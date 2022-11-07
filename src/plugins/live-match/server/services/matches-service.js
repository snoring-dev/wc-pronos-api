"use strict";
const GlobalRepo = require("../repositories/");

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
        first_player_to_score: true,
        first_team_to_score: true,
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

  async saveResult(requestBody) {
    const { matchId, result } = requestBody.data;
    // const player = GlobalRepo.getPlayerById(result.firstPlayerToScore);
    // const team = GlobalRepo.getTeamById(result.firstTeamToScore);
    const match = await strapi.entityService.update(
      "api::match.match",
      matchId,
      {
        data: {
          left_score: result.score.leftSide,
          right_score: result.score.rightSide,
          final_score_string: result.score.resultString,
          finished: true,
          first_player_to_score: result.firstPlayerToScore,
          first_team_to_score: result.firstTeamToScore,
        },
      }
    );

    return match;
  },

  async parsePrediction(ctx) {
    const { matchId = null, userId = null } = ctx.request.body;
    return await GlobalRepo.executePrediction(strapi, matchId, userId);
  },

  async parseAllPredictions(ctx) {
    const { data: { matchId } } = ctx.request.body;
    const pronosForMatch = await GlobalRepo.getPredictionsForMatch(
      strapi,
      matchId
    );
    if (pronosForMatch.length > 0) {
      const execData = pronosForMatch.map((p) =>
        GlobalRepo.executePrediction(strapi, matchId, p.owner.id)
      );
      return execData;
    }

    return ctx.badRequest("Something went wrong", {
      message: "Cannot proceed with this match id!",
      status: 404,
    });
  },
});
