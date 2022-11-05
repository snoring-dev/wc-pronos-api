"use strict";
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    var io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
    });
    io.on("connection", function (socket) {
      console.log(`====> SOCKET: ${socket.id} user just connected! <====`);
      socket.on('disconnect', () => {
        socket.disconnect()
        console.log('====> SOCKET: A user disconnected <====');
      });
    });
  },
};