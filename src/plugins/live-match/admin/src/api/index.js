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
};

export default matchRequests;
