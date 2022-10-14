'use strict';

/**
 * pronostic service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pronostic.pronostic');
