"use strict";

/**
 *  tournament controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::tournament.tournament",
  ({ strapi }) => ({
    async getAll() {
      const cup = await strapi.db
        .query("api::tournament.tournament")
        .findMany({
          populate: {
            groups: {
              populate: {
                teams: {
                  populate: {
                    players: true,
                  },
                },
                table: {
                    populate: {
                        entries: {
                            populate: {
                                team: true,
                            }
                        },
                    },
                },
              },
            },
          },
        });
      return cup;
    },
  })
);
