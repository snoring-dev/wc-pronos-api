"use strict";

/**
 *  community controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const getUserById = async (strapi, userId) => {
  const user = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: {
      id: {
        $eq: userId,
      },
    },
    populate: {
      score: true,
    },
  });
  return user;
};

const getCommunityByCode = async (strapi, accessCode) => {
  const entries = await strapi.entityService.findMany(
    "api::community.community",
    {
      filters: { access_code: accessCode },
      populate: {
        users: {
          populate: {
            profile: {
              populate: {
                picture: true,
              },
            },
          },
        },
      },
    }
  );

  if (entries.length > 0) {
    return entries[0];
  }

  return null;
};

const getCommunityById = async (strapi, id) => {
  const community = await strapi.entityService.findOne(
    "api::community.community",
    id,
    {
      populate: {
        users: {
          populate: {
            profile: {
              populate: {
                picture: true,
              },
            },
          },
        },
        user_score_communities: {
          populate: {
            user: {
              populate: {
                profile: {
                  populate: {
                    picture: true,
                  },
                },
              },
            },
            score: true,
          },
        },
      },
    }
  );

  return community;
};

const updateRankings = async (strapi, ranked) => {
  ranked.forEach(async (item) => {
    await strapi.entityService.update(
      "api::user-score-community.user-score-community",
      item.id,
      {
        data: {
          current_ranking: item.ranking,
          previous_ranking: item.prevRanking,
        },
      }
    );
  });
};

module.exports = createCoreController(
  "api::community.community",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const { name, winning_prize, access_code, userId } = ctx.request.body;
        // Retrieve user
        const user = await getUserById(strapi, userId);
        // Create the community record
        await strapi.entityService.create("api::community.community", {
          data: {
            name,
            winning_prize,
            access_code,
            users: [user],
          },
        });

        const entry = await getCommunityByCode(strapi, access_code);

        return { data: entry };
      } catch (e) {
        return ctx.badRequest("Something went wrong", {
          message: "Community cannot be created",
          status: 500,
        });
      }
    },

    async all(ctx) {
      try {
        const { userId } = ctx.request.query;
        const entries = await strapi.entityService.findMany(
          "api::community.community",
          {
            populate: {
              users: {
                populate: {
                  profile: {
                    populate: {
                      picture: true,
                    },
                  },
                },
              },
            },
          }
        );

        if (!userId) {
          return { data: entries };
        }

        const associatedEntries = entries.filter((e) => {
          const ids = e.users.reduce((c, v) => [...c, v.id], []);
          return ids.includes(Number(userId));
        });

        return { data: associatedEntries };
      } catch (e) {
        console.log(e);
        return ctx.badRequest("ERROR", {
          message: "Communitites cannot be fetched",
          status: 500,
        });
      }
    },

    async join(ctx) {
      try {
        const { access_code, userId } = ctx.request.body;
        const user = await getUserById(strapi, userId);
        const community = await getCommunityByCode(strapi, access_code);
        if (community && user) {
          await strapi.entityService.update(
            "api::community.community",
            community.id,
            {
              data: {
                users: [...community.users, user],
              },
            }
          );

          // Create the related ranking record
          await strapi.entityService.create(
            "api::user-score-community.user-score-community",
            {
              data: {
                score: user?.score?.id,
                community: community.id,
                user: user.id,
              },
            }
          );

          const cmn = await getCommunityByCode(strapi, access_code);

          return { data: cmn };
        } else {
          return ctx.badRequest("Oups!", {
            message: "You can't join this community",
            status: 500,
          });
        }
      } catch (e) {
        return ctx.badRequest("Oups!", {
          message: "You can't join this community",
          status: 500,
        });
      }
    },

    async getCommunityDetails(ctx) {
      try {
        const { id } = ctx.request.params;
        let community = await getCommunityById(strapi, id);
        const { user_score_communities } = community;

        // formating data
        const data = user_score_communities.map((item) => ({
          id: item.id,
          ranking: item.current_ranking,
          prevRanking: item.previous_ranking,
          score: item.score.value,
        }));

        data.sort((a, b) => b.score - a.score);

        // update ranking
        const ranked = data.map((item, index) => ({
          ...item,
          prevRanking: item.ranking,
          ranking: index + 1,
        }));

        // update database
        await updateRankings(strapi, ranked);

        // find the last comminity data
        community = await getCommunityById(strapi, id);

        if (community) return { data: community };
        else
          return ctx.badRequest("Oups!", {
            message: "Community not found!",
            status: 404,
          });
      } catch (e) {
        console.log(e);
        return ctx.badRequest("Oups!", {
          message: "You can't join this community",
          status: 500,
        });
      }
    },
  })
);
