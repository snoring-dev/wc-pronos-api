'use strict';
const GlobalRepo = require('../repositories/');

module.exports = ({ strapi }) => ({
  async findAllMatches() {
    const matches = await strapi.entityService.findMany("api::match.match", {
      populate: {
        left_side: {
          populate: {
            players: true,
            flag: true,
          },
        },
        right_side: {
          populate: {
            players: true,
            flag: true,
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
        };
      })
    );

    return results;
  },
});
