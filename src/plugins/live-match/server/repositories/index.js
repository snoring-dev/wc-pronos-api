const setScoreForUser = async (strapi, score, user) => {
    if (!user.score) {
      const record = await strapi.entityService.create("api::score.score", {
        data: {
          value: score,
          user: user.id,
        },
      });
  
      return record;
    }
  
    const previousScore = user.score.value;
    return await strapi.entityService.update("api::score.score", user.score.id, {
      data: {
        value: score + previousScore,
      },
    });
  };
  
  const setPredictionAsParsed = async (strapi, prono) => {
    return await strapi.entityService.update(
      "api::pronostic.pronostic",
      prono.id,
      {
        data: {
          parsed: true,
        },
      }
    );
  };
  
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
    const prediction = await strapi.db.query("api::pronostic.pronostic").findOne({
      where: {
        match_id: matchId,
        owner: user,
      },
    });
    return prediction;
  };
  
  const getPredictionsForUser = async (strapi, userId) => {
    const user = await getUserById(strapi, userId);
    const predictions = await strapi.db
      .query("api::pronostic.pronostic")
      .findMany({
        where: {
          owner: user,
        },
      });
    return predictions;
  };
  
  const getPredictionsForMatch = async (strapi, matchId) => {
    const predictions = await strapi.db
      .query("api::pronostic.pronostic")
      .findMany({
        where: {
          match_id: matchId,
        },
        populate: {
          owner: {
            populate: {
              profile: {
                populate: {
                  picture: true,
                },
              },
            },
          },
        },
      });
    return predictions;
  };
  
  module.exports = {
    setScoreForUser,
    setPredictionAsParsed,
    getUserById,
    getTeamById,
    getPlayerById,
    getMatchById,
    getSinglePrediction,
    getPredictionsForUser,
    getPredictionsForMatch,
  };
  