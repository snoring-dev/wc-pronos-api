"use strict";

/**
 *  community controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const getUserById = async (userId) => {
  const user = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: {
      id: {
        $eq: userId,
      },
    },
  });
  return user;
};

module.exports = createCoreController(
  "api::community.community",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        const { name, winning_prize, access_code, userId } = ctx.request.body;
        // Retrieve user
        const user = await getUserById(userId);
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

        return { data: record };
      } catch (e) {
        return ctx.badRequest("Something went wrong", {
          message: "Community cannot be created",
          status: 500,
        });
      }
    },

    async all(ctx) {
      try {
        const entries = await strapi.entityService.findMany('api::community.community', {
          populate: {
            users: {
              populate: {
                profile: true,
              },
            },
          },
        });

        return { data: entries };
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
