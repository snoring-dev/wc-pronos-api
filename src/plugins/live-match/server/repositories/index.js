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

const compareScore = (l1, r1, l2, r2) => {
  const score1 = Math.abs(l1 - r1);
  const score2 = Math.abs(l2 - r2);
  if (score1 > score2) return 1;
  else if (score1 < score2) return -1;
  return 0;
};

const executePrediction = async (strapi, matchId, userId) => {
  let score = 0;
  const user = await getUserById(strapi, userId);
  // get a single prediction
  const prono = await getSinglePrediction(strapi, userId, matchId);
  // get the match
  const match = await getMatchById(strapi, matchId);
  if (prono && !prono.parsed && match && prono.match_id === match.id) {
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
    const guessResult = `${predicted_result.leftSide} - ${predicted_result.rightSide}`;
    const exactResult = match.final_score_string === guessResult;
    if (exactResult) score += 3;
    // if not, but still have a win: +1
    else {
      if (hasPredictedTheWinner(predicted_result, match)) score += 1;
      if (
        compareScore(
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

    const updatedScore = await setScoreForUser(strapi, score, user);
    await setPredictionAsParsed(strapi, prono);

    return { data: { prediction: { ...prono }, updatedScore } };
  }

  return false;
};

const getWinner = (left, right) => {
  if (left > right) return "left";
  else if (left < right) return "right";
  return null;
};

const hasPredictedTheWinner = (predicted_result, match) => {
  const w1 = getWinner(predicted_result.leftSide, predicted_result.rightSide);
  const w2 = getWinner(match.left_score, match.right_score);
  return w1 === w2;
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
  compareScore,
  executePrediction,
  getWinner,
  hasPredictedTheWinner,
};
