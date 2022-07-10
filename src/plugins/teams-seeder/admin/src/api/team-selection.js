import { request } from "@strapi/helper-plugin";

const teamSelectionRequests = {
  findAll: async () => {
    return await request("/teams-seeder/find", {
      method: "GET",
    });
  },

  addSeed: async (data) => {
    return await request(`/teams-seeder/create`, {
      method: "POST",
      body: { data: data },
    });
  },

  toggleSeed: async (id) => {
    return await request(`/teams-seeder/toggle/${id}`, {
      method: "PUT",
    });
  },

  editSeed: async (id, data) => {
    return await request(`/teams-seeder/update/${id}`, {
      method: "PUT",
      body: { data: data },
    });
  },

  deleteSeed: async (id) => {
    return await request(`/teams-seeder/delete/${id}`, {
      method: "DELETE",
    });
  },
};

export default teamSelectionRequests;
