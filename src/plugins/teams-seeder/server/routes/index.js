const teamSelectionRoutes = require('./team-selection');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  ...teamSelectionRoutes,
];
