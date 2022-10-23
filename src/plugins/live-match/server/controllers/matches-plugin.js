'use strict';

module.exports = {
  async findAll(ctx) {
    ctx.body = await strapi
      .plugin('live-match')
      .service('matchesService')
      .findAllMatches();
  },

  async saveResult(ctx) {
    ctx.body = await strapi
      .plugin('live-match')
      .service('matchesService')
      .saveResult(ctx.request.body);
  },

  async parse(ctx) {
    ctx.body = 'hello world!';
  },
};
