'use strict';

module.exports = function(app) {
  var Boom = require('boom');
  var logger = require(__dirname + '/../../utils/logger')(app);
  var raccoon = require(__dirname + '/../../index.js');


  var Customer = app.models.Customer;
  var Receipt = app.models.Receipt;
  var ReceiptProduct = app.models.ReceiptProduct;

  var exports = {}; // returned object

  exports.name = 'customer';

  exports.query = {
    description: 'List customers',
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

  exports.getRecomendations = {
    description: 'List customer recomendations',
    handler: (request, reply) => {
      raccoon.recommendFor(request.params.name, 10, function(recomendations) {
        //console.log('recomendations', recomendations);
        //raccoon.flush();
        reply(recomendations);
      });
    }
  };

  exports.setLiked = {
    description: 'Set customer like',
    handler: (request, reply) => {
      raccoon.liked(request.payload.name, request.payload.productId, function() {
        reply('Like set for ' + request.payload.name + ' product ' + request.payload.productId);
      });

    }
  };

  return exports;
};
