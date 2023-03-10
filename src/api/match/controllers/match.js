"use strict";
const dayjs = require('dayjs')
const GlobalRepo = require("../../../repositories/global.repository");

/**
 *  match controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::match.match", ({ strapi }) => ({
  async find(ctx) {
    const matches = await strapi.entityService.findMany("api::match.match", {
      populate: {
        left_side: {
          populate: {
            flag: true,
            players: {
              populate: {
                media: true,
              }
            },
          },
        },
        right_side: {
          populate: {
            flag: true,
            players: {
              populate: {
                media: true,
              }
            },
          },
        },
      },
    });

    const results = await Promise.all(
      matches.map(async (match) => {
        const predictions = await GlobalRepo.getPredictionsForMatch(
          strapi,
          match.id
        );
        return {
          ...match,
          predictions,
          isOld: !(dayjs().isBefore(dayjs(match.played_at))),
        };
      })
    );

    return { data: results };
  },
}));
