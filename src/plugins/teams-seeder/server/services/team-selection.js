"use strict";

/**
 *  service.
 */
const pluginCollectionName = "plugin::teams-seeder.team-selection";

module.exports = ({ strapi }) => ({
  async find(query) {
    return await strapi.entityService.findMany(
      pluginCollectionName,
      query
    );
  },

  async create(data) {
    console.log('CREATE:', data);
    return await strapi.entityService.create(pluginCollectionName, data);
  },

  async update(id, data) {
    return await strapi.entityService.update(pluginCollectionName, id, data);
  },

  async delete(id) {
    return await strapi.entityService.delete(pluginCollectionName, id);
  },

  async toggle(id) {
    const result = await strapi.entityService.findOne(pluginCollectionName, id);
    return await strapi.entityService.update(pluginCollectionName, id, {
      data: { parsed: !result.parsed },
    });
  },

  async executePayloadFor(id) {
    const payload = await strapi.entityService.findOne(pluginCollectionName, id);
    const teams = await strapi.entityService.findMany('api::team.team');
    const theTeam = teams.find(tm => tm.country_code === payload.country_code);
    if (theTeam) {
      try {
        for (let index = 0; index < payload.players_payload.players.length; index++) {
          const element = payload.players_payload.players[index];
          await strapi.entityService.create('api::player.player', {
            data: {
              fullname: element.fullName,
              shirt_number: element.number !== "" ? Number(element.number) : 0,
              team: theTeam,
            },
          });
        }
        return payload.players_payload;
      } catch(err) {
        console.log(err);
        return null;
      }
    }

    return null;
  },
});
