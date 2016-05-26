'use strict';

module.exports = function(app) {
  var Boom = require('boom');
  var Joi = require('joi');
  var logger = require(__dirname + '/../../utils/logger')(app);
  var raccoon = require(__dirname + '/../../index.js');

  var Receipt = app.models.Receipt;
  var ReceiptProduct = app.models.ReceiptProduct;

  var exports = {}; // returned object

  exports.name = 'recommendation';

  exports.getRecommendations = {
    description: 'List customer recommendations',
    tags: ['api', 'customer', 'recommendations'],
    validate: {
      params: {
        name: Joi.string().required()
      }
    },
    handler: (request, reply) => {
      raccoon.recommendFor(request.params.name, 10, function(recommendations) {
        reply(recommendations);
      });
    }
  };

  exports.setLiked = {
    description: 'Set customer like',
    tags: ['api', 'customer', 'recommendations'],
    validate: {
      payload: {
        name: Joi.string().required(),
        productId: Joi.number().required()
      }
    },
    handler: (request, reply) => {
      raccoon.liked(request.payload.name, request.payload.productId, function() {
        reply('Like set for ' + request.payload.name + ' product ' + request.payload.productId);
      });
    }
  };

  exports.setBatchLiked = {
    description: 'Set customer like in batch',
    tags: ['api', 'customer', 'recommendations'],
    validate: {
      payload: {
        receiptIds: Joi.array().min(1).required()
      }
    },
    handler: (request, reply) => {

      var successPromise = new Promise(function(resolve, reject) {
        Receipt.findAll({
          where: {
            id: request.payload.receiptIds
          },
          include: {
            model: ReceiptProduct
          }
        }).then(function(receipts) {
          if (!receipts) {
            logger.error("Cannot retrieve receipts or no receipts at all.");
            reject("Cannot retrieve receipts or no receipts at all.");
          }

          var receiptsPromises = receipts.map(function(receipt) {
            return new Promise(function(resolve1, reject1) {
              var productsPromises = receipt.ReceiptProducts.map(function(product) {
                return new Promise(function(resolve2, reject2) {
                  raccoon.liked(receipt.customerId.toString(), product.productId.toString(), function() {
                    resolve2('Customer ' + receipt.customerId + ' liked ' + product.productId);
                  });
                });
              });
              Promise.all(productsPromises).then(function(productLikes) {
                console.log(productLikes);
                resolve1('Receipt ' + receipt.id + ' processed.');
              });
            });
          });
          Promise.all(receiptsPromises).then(function(receiptsProcessed) {
            console.log(receiptsProcessed);
            resolve(receiptsProcessed);
          });

        }).catch(function(e) {
          logger.error("Cannot retrieve receipts or no receipts at all. Error: " + e);
          reply(Boom.badData(e));
        });
      });

      successPromise.then(function(results) {
        reply(results);
      }).catch(function(reason) {
        reply(Boom.badData(reason));
      });
    }
  };

  return exports;
};
