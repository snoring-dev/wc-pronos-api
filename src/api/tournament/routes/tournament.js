"use strict";

/**
 * community router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;
const originalRouter = createCoreRouter('api::tournament.tournament');

const defaultRouter = (innerRouter, routeOveride = [], extraRoutes = []) => {
  let routes;

  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes;

      const newRoutes = routes.map((route) => {
        let found = false;

        routeOveride.forEach((overide) => {
          if (
            route.handler === overide.handler &&
            route.method === overide.method
          ) {
            found = overide;
          }
        });

        return found || route;
      });

      return extraRoutes.concat(newRoutes);
    },
  };
};

const myExtraRoutes = [
  {
    method: "GET",
    path: "/tournaments/all",
    handler: "api::tournament.tournament.getAll",
    config: {
      auth: false,
    },
  },
];

const myOverideRoute = [];

module.exports = defaultRouter(originalRouter, myOverideRoute, myExtraRoutes);

