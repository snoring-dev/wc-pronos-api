"use strict";

/**
 * community router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::community.community");

const customRouter = (innerRouter, routeOveride = [], extraRoutes = []) => {
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
    path: "/communities/all",
    handler: "api::community.community.all",
    config: {
      auth: true,
    },
  },
];

const myOverideRoute = [];

module.exports = customRouter(defaultRouter, myOverideRoute, myExtraRoutes);