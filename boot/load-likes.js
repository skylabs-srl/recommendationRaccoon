'use strict';

module.exports = function(app) {

  var raccoon = require(__dirname + '/../index.js');
  const logger = require(__dirname + '/../utils/logger')(app);

  var Customer = app.models.Customer;
  var Receipt = app.models.Receipt;
  var ReceiptProduct = app.models.ReceiptProduct;

  var success = false;

  var successPromise = new Promise(function(resolve, reject){

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
          return logger.error("Cannot retrieve users or no users at all.");
        }

        var customersPromises = customers.map(function(customer) {
          return new Promise(function(resolve1, reject1) {
            var receiptsPromises = customer.Receipts.map(function(receipt) {
              return new Promise(function(resolve2, reject2) {
                var productsPromises = receipt.ReceiptProducts.map(function(product) {
                  return new Promise(function(resolve3, reject3) {
                    raccoon.liked(parseInt(customer.id), parseInt(product.productId), function() {
                      resolve3('Customer ' + customer.id + ' liked ' + product.productId);
                    });
                  });
                });
                Promise.all(productsPromises).then(function(productLikes) {
                  console.log(productLikes);
                  resolve2('Receipt ' + receipt.id + ' processed.');

                });
              });
            });
            Promise.all(receiptsPromises).then(function(receiptsProcessed) {
              console.log(receiptsProcessed);
              resolve1('Customer ' + customer.id + ' processed.');
            });
          });
        });

        Promise.all(customersPromises).then(function(customersProcessed) {
          console.log(customersProcessed);
          success = true;
          raccoon.recommendFor('1', '10', function(recomendations) {
            console.log('recomendations', recomendations);
          });
          raccoon.mostSimilarUsers('1', function(results) {
            console.log('mostSimilarUsers' + results);
            // returns an array of the 'similaritySet' ranked sorted set for the user which
            // represents their ranked similarity to all other users given the
            // Jaccard Coefficient. the value is between -1 and 1. -1 means that the
            // user is the exact opposite, 1 means they're exactly the same.
            // ex. results = ['garyId', 'andrewId', 'jakeId']
          });

          raccoon.leastSimilarUsers('1', function(results) {
            console.log('leastSimilarUsers' + results);
            // same as mostSimilarUsers but the opposite.
            // ex. results = ['timId', 'haoId', 'phillipId']
          });

          raccoon.bestRated(function(results) {
            console.log('bestRated' + results);
            // returns an array of the 'scoreBoard' sorted set which represents the global
            // ranking of items based on the Wilson Score Interval. in short it represents the
            // 'best rated' items based on the ratio of likes/dislikes and cuts out outliers.
            // ex. results = ['iceageId', 'sleeplessInSeattleId', 'theDarkKnightId']
          });

          raccoon.worstRated(function(results) {
            console.log('worstRated' + results);
            // same as bestRated but in reverse.
          });

          raccoon.mostLiked(function(results) {
            console.log('mostLiked' + results);
            // returns an array of the 'mostLiked' sorted set which represents the global
            // number of likes for all the items. does not factor in dislikes.
          });

          raccoon.mostDisliked(function(results) {
            console.log('mostDisliked' + results);
            // same as mostLiked but the opposite.
          });

          raccoon.likedBy('1', function(results) {
            console.log('likedBy' + results);
            // returns an array which lists all the users who liked that item.
          });

          raccoon.likedCount('1', function(results) {
            console.log('likedCount' + results);
            // returns the number of users who have liked that item.
          });

          raccoon.dislikedBy('1', function(results) {
            console.log('dislikedBy' + results);
            // same as likedBy but for disliked.
          });

          raccoon.dislikedCount('1', function(results) {
            console.log('dislikedCount' + results);
            // same as likedCount but for disliked.
          });

          raccoon.allLikedFor('1', function(results) {
            console.log('allLikedFor' + results);
            // returns an array of all the items that user has liked.
          });

          raccoon.allDislikedFor('1', function(results) {
            console.log('allDislikedFor' + results);
            // returns an array of all the items that user has disliked.
          });

          raccoon.allWatchedFor('1', function(results) {
            console.log('allWatchedFor' + results);
            // returns an array of all the items that user has liked or disliked.
          });

          resolve(success);

        });

      })
      .catch((e) => {
        logger.error("Cannot retrieve users or no users at all. Error: " + e);
        reject('db error');
      });
    });

  return successPromise;
};
