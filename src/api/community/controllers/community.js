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

module.exports = createCoreController(
  "api::community.community",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const { name, winning_prize, access_code, userId } = ctx.request.body;
        // Retrieve user
        const user = await getUserById(strapi, userId);
        // Create the community record
        const record = await strapi.entityService.create(
          "api::community.community",
          {
            data: {
              name,
              winning_prize,
              access_code,
              users: [user],
            },
          }
        );

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

        const associatedEntries = entries.filter(e => {
          const ids = e.users.reduce((c, v) => ([...c, v.id]), []);
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
          const entry = await strapi.entityService.update(
            "api::community.community",
            community.id,
            {
              data: {
                users: [...community.users, user],
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
            },
          }
        );
        if (community)
          return { data: community };
        else
          return ctx.badRequest("Oups!", {
            message: "Community not found!",
            status: 404,
          });
      } catch (e) {
        return ctx.badRequest("Oups!", {
          message: "You can't join this community",
          status: 500,
        });
      }
    }
  })
);
