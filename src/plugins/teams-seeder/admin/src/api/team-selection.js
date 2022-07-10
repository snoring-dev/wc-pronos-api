import { request } from "@strapi/helper-plugin";

const teamSelectionRequests = {
  findAll: async () => {
    return await request("/teams-seeder/find", {
      method: "GET",
    });
  },
};

export default teamSelectionRequests;
