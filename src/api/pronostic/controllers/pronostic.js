"use strict";

const { user } = require("pg/lib/defaults");

/**
 *  pronostic controller
 *
 *
 * {
 *   "matchId": 1,
 * 	"predictedResult": {
 * 		"leftSide": 1,
 * 		"rightSide": 0
 * 	},
 * 	"firstTeamToScore": 23,
 * 	"firstPlayerToScore": 45
 * }
 */

const { createCoreController } = require("@strapi/strapi").factories;
const collection = "api::pronostic.pronostic";

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

const getTeamById = async (strapi, teamId) => {
  const team = await strapi.db.query("api::team.team").findOne({
    where: {
      id: {
        $eq: teamId,
      },
    },
  });
  return team;
};

const getPlayerById = async (strapi, playerId) => {
  const player = await strapi.db.query("api::player.player").findOne({
    where: {
      id: {
        $eq: playerId,
      },
    },
  });
  return player;
};

const getMatchById = async (strapi, matchId) => {
  const match = await strapi.db.query("api::match.match").findOne({
    where: {
      id: {
        $eq: matchId,
      },
    },
    populate: {
      first_player_to_score: true,
      first_team_to_score: true,
    },
  });
  return match;
};

const getSinglePrediction = async (strapi, userId, matchId) => {
  const user = await getUserById(strapi, userId);
  const prediction = await strapi.db.query(collection).findOne({
    where: {
      match_id: matchId,
      owner: user,
    },
  });
  return prediction;
};

const getPredictionsForUser = async (strapi, userId) => {
  const user = await getUserById(strapi, userId);
  const predictions = await strapi.db.query(collection).findMany({
    where: {
      owner: user,
    },
  });
  return predictions;
};

const getPredictionsForMatch = async (strapi, matchId) => {
  const predictions = await strapi.db.query(collection).findMany({
    where: {
      match_id: matchId,
    },
  });
  return predictions;
};

const getWinner = (left, right) => {
  if (left > right) return "left";
  else if (left < right) return "right";
  return null;
};

const hasPredictedTheWinner = (predicted_result, match) => {
  const w1 = getWinner(predicted_result.leftSide, predicted_result.righSide);
  const w2 = getWinner(match.leftScore, match.rightScore);
  return w1 === w2;
};

const compareScore = (l1, r1, l2, r2) => {
  const score1 = Math.abs(l1 - r1);
  const score2 = Math.abs(l2 - r2);
  if (score1 > score2) return 1;
  else if (score1 < score2) return -1;
  return 0;
};

module.exports = createCoreController(collection, ({ strapi }) => ({
  async setPrediction(ctx) {
    const {
      matchId,
      userId,
      predictedResult,
      firstTeamToScore,
      firstPlayerToScore,
    } = ctx.request.body;
    const usedMatch = await getMatchById(strapi, matchId);
    const predictionOwner = await getUserById(strapi, userId);
    if (usedMatch && predictionOwner) {
      const record = await strapi.entityService.create(collection, {
        data: {
          match_id: matchId,
          first_team_to_score: firstTeamToScore,
          first_player_to_score: firstPlayerToScore,
          predicted_result: predictedResult,
          owner: predictionOwner,
        },
      });
      return { data: record };
    }

    return ctx.badRequest("Something went wrong", {
      message: "Match and/or User not found!",
      status: 404,
    });
  },

  async allPrediction(ctx) {
    const { matchId = null, userId = null } = ctx.request.query;
    if (matchId && userId) {
      // get a single prediction
      const prono = await getSinglePrediction(strapi, userId, matchId);
      return { data: prono };
    } else if (matchId && !userId) {
      // get all prediction for a match
      const pronosForMatch = await getPredictionsForMatch(strapi, matchId);
      return { data: pronosForMatch };
    } else if (userId && !matchId) {
      // get all predictions done by a user
      const pronosByUser = await getPredictionsForUser(strapi, userId);
      return { data: pronosByUser };
    }

    // get all predictions
    const entries = await strapi.entityService.findMany(collection, {
      populate: {
        owner: true,
      },
    });

    return { data: entries };
  },

  async parsePrediction(ctx) {
    let score = 0;
    const { matchId = null, userId = null } = ctx.request.body;
    // get a single prediction
    const prono = await getSinglePrediction(strapi, userId, matchId);
    // get the match
    const match = await getMatchById(strapi, matchId);
    if (prono && match && prono.match_id === match.id) {
      const firstPlayerToScrore = await getPlayerById(
        strapi,
        prono.first_player_to_score
      );
      const firstTeamToScore = await getTeamById(
        strapi,
        prono.first_team_to_score
      );
      const { predicted_result } = prono;
      // RULES:
      // if the result is exacte: +3 pt
      const exactResult =
        predicted_result.leftSide === match.leftScore &&
        predicted_result.righSide === match.rightScore;
      if (exactResult) score += 3;
      // if not, but still have a win: +1
      else {
        if (hasPredictedTheWinner(predicted_result, match)) score += 1;
        if (
          compareScore(
            predicted_result.leftSide,
            predicted_result.righSide,
            match.leftScore,
            match.rightScore
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

      // @TODO: u still have to update the prediction to PARSED!

      return { data: { prediction: { ...prono }, score } };
    } else {
      return ctx.badRequest("Something went wrong", {
        message: "Your prediction does not correspond to the selected Match",
        status: 404,
      });
    }
  },
}));
