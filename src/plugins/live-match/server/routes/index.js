module.exports = [
  {
    method: "GET",
    path: "/find-all",
    handler: "matchPluginController.findAll",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/parse",
    handler: "matchPluginController.parse",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/parseAll",
    handler: "matchPluginController.parseAll",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/save-result",
    handler: "matchPluginController.saveResult",
    config: {
      policies: [],
      auth: false,
    },
  },
];
