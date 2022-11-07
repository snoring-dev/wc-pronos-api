import { request } from "@strapi/helper-plugin";

const matchRequests = {
  findAll: async () => {
    return await request('/live-match/find-all', {
      method: "GET",
    });
  },
  parsePrediction: async (matchId, userId) => {
    return await request('/live-match/parse', {
      method: "POST",
      body: { data: { matchId, userId } },
    });
  },
  parseAllPredictions: async (matchId) => {
    return await request('/live-match/parseAll', {
      method: "POST",
      body: { data: { matchId } },
    });
  },
  saveResult: async (matchId, result) => {
    return await request('/live-match/save-result', {
      method: "POST",
      body: { data: { matchId, result } },
    });
  },
};

export default matchRequests;
