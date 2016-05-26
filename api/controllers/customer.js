'use strict';

module.exports = function(app) {
  var Boom = require('boom');
  var Joi = require('joi');
  var logger = require(__dirname + '/../../utils/logger')(app);
  var raccoon = require(__dirname + '/../../index.js');


  var Customer = app.models.Customer;
  var Receipt = app.models.Receipt;
  var ReceiptProduct = app.models.ReceiptProduct;

  var exports = {}; // returned object

  exports.name = 'customer';

  exports.query = {
    description: 'List customers',
    tags: ['api', 'customers'],
    handler: (request, reply) => {

      Customer
        .findAll({
          include: {
            model: Receipt,
            include: {
              model: ReceiptProduct
            }
          }
        })
        .then(function(customers) {
          if (!customers) {
            logger.error("Cannot retrieve users or no users at all.");
            return reply(Boom.notFound("Cannot retrieve customers or no users at all."));
          }

          reply(customers);
        })
        .catch((e) => {
          logger.error("Cannot retrieve users or no users at all. Error: " + e);
          reply(Boom.badData(e));
        });
    }
  };

  return exports;
};
