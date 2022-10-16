'use strict';

module.exports = {
  async findAll(ctx) {
    ctx.body = await strapi
      .plugin('live-match')
      .service('matchesService')
      .findAllMatches();
  },

  async parse(ctx) {
    ctx.body = 'hello world!';
  },
};
