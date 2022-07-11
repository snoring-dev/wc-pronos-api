"use strict";

/**
 *  router.
 */

module.exports = [
  {
    method: "GET",
    path: "/find",
    handler: "teamSelectionController.find",
    config: {
      policies: [],
      auth: false,
    },
  },

  {
    method: "GET",
    path: "/parse",
    handler: "teamSelectionController.parsePayload",
    config: {
      policies: [],
      auth: false,
    },
  },

  {
    method: "POST",
    path: "/create",
    handler: "teamSelectionController.create",
    config: {
      policies: [],
    },
  },

  {
    method: "DELETE",
    path: "/delete/:id",
    handler: "teamSelectionController.delete",
    config: {
      policies: [],
    },
  },

  {
    method: "PUT",
    path: "/toggle/:id",
    handler: "teamSelectionController.toggle",
    config: {
      policies: [],
    },
  },

  {
    method: "PUT",
    path: "/update/:id",
    handler: "teamSelectionController.update",
    config: {
      policies: [],
    },
  },
];
