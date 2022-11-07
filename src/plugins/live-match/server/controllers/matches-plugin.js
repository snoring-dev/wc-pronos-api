"use strict";
const GlobalRepo = require('../repositories');

module.exports = {
  async findAll(ctx) {
    ctx.body = await strapi
      .plugin("live-match")
      .service("matchesService")
      .findAllMatches();
  },

  async saveResult(ctx) {
    ctx.body = await strapi
      .plugin("live-match")
      .service("matchesService")
      .saveResult(ctx.request.body);
  },

  async parse(ctx) {
    const { data: { matchId, userId } } = ctx.request.body;
    let score = 0;
    const user = await GlobalRepo.getUserById(strapi, userId);
    // get a single prediction
    const prono = await GlobalRepo.getSinglePrediction(strapi, userId, matchId);
    // get the match
    const match = await GlobalRepo.getMatchById(strapi, matchId);

    if (prono && !prono.parsed && match && prono.match_id === match.id) {
      const firstPlayerToScrore = await GlobalRepo.getPlayerById(
        strapi,
        prono.first_player_to_score
      );
      const firstTeamToScore = await GlobalRepo.getTeamById(
        strapi,
        prono.first_team_to_score
      );
      const { predicted_result } = prono;
      // RULES:
      // if the result is exacte: +3 pt
      const guessResult = `${predicted_result.leftSide} - ${predicted_result.rightSide}`;
      const exactResult = match.final_score_string === guessResult;
      if (exactResult) score += 3;
      // if not, but still have a win: +1
      else {
        if (GlobalRepo.hasPredictedTheWinner(predicted_result, match)) score += 1;
        if (
          GlobalRepo.compareScore(
            predicted_result.leftSide,
            predicted_result.rightSide,
            match.left_score,
            match.right_score
          ) === 0
        ) {
          score += 1;
        }
      }
      if (firstPlayerToScrore.id === match.first_player_to_score.id) {
        score += 1;
      }
      if (firstTeamToScore.id === match.first_team_to_score.id) {
        score += 1;
      }
  
      const updatedScore = await GlobalRepo.setScoreForUser(strapi, score, user);
      await GlobalRepo.setPredictionAsParsed(strapi, prono);
  
      return { data: { prediction: { ...prono }, updatedScore } };
    } else {
      return ctx.badRequest("Something went wrong", {
        message: "Your prediction is alrady parsed",
        status: 404,
      });
    }
  },

  async parseAll(ctx) {
    return await strapi
      .plugin("live-match")
      .service("matchesService")
      .parseAllPredictions(ctx);
  },
};
