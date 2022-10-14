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

const getMatchById = async (strapi, matchId) => {
  const match = await strapi.db.query("api::match.match").findOne({
    where: {
      id: {
        $eq: matchId,
      },
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
}));
