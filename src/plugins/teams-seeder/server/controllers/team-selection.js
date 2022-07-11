"use strict";

/**
 *   controller
 */

module.exports = {
  async find(ctx) {
    try {
      const { query } = ctx;
      return await strapi
        .plugin('teams-seeder')
        .service('teamSelectionService')
        .find(query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async parsePayload(ctx) {
    try {
      const { query: { id } } = ctx;
      return await strapi
        .plugin('teams-seeder')
        .service('teamSelectionService')
        .executePayloadFor(id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async delete(ctx) {
    try {
      ctx.body = await strapi
        .plugin('teams-seeder')
        .service('teamSelectionService')
        .delete(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx) {
    try {
      ctx.body = await strapi
        .plugin('teams-seeder')
        .service('teamSelectionService')
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx) {
    try {
      ctx.body = await strapi
        .plugin('teams-seeder')
        .service('teamSelectionService')
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async toggle(ctx) {
    try {
      ctx.body = await strapi
        .plugin('teams-seeder')
        .service('teamSelectionService')
        .toggle(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
