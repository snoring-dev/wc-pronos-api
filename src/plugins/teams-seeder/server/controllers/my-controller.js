'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('teams-seeder')
      .service('myService')
      .getWelcomeMessage();
  },
};
