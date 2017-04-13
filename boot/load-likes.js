'use strict';

module.exports = function(app) {

  var raccoon = require(__dirname + '/../index.js');
  const logger = require(__dirname + '/../utils/logger')(app);

  var Customer = app.models.Customer;
  var Receipt = app.models.Receipt;
  var ReceiptProduct = app.models.ReceiptProduct;

  var success = false;

  var successPromise = new Promise(function(resolve, reject) {
    /*
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

        console.log('customers', customers);

        var customersPromises = customers.map(function(customer) {//swicth to map async??
          return new Promise(function(resolve1, reject1) {
            var receiptsPromises = customer.Receipts.map(function(receipt) {
              return new Promise(function(resolve2, reject2) {
                var productsPromises = receipt.ReceiptProducts.map(function(product) {
                  return new Promise(function(resolve3, reject3) {
                    raccoon.liked(customer.note, product.productId.toString(), function() {
                      console.log('Customer ' + customer.note + ' liked ' + product.productId);
                      resolve3('Customer ' + customer.note + ' liked ' + product.productId);
                    });
                  });
                });
                Promise.all(productsPromises).then(function(productLikes) {
                  console.log('productLikes', productLikes);
                  resolve2('Receipt ' + receipt.id + ' processed.');

                });
              });
            });
            Promise.all(receiptsPromises).then(function(receiptsProcessed) {
              console.log('receiptsProcessed', receiptsProcessed);
              resolve1('Customer ' + customer.id + ' processed.');
            });
          });
        });

        return Promise.all(customersPromises);
      })
      .then((customersProcessed) => {
        console.log('customersProcessed', customersProcessed);
        resolve(customersProcessed);
      })
      .catch((e) => {
        logger.error("Cannot retrieve users or no users at all. Error: " + e);
        reject('DB error');
      });
    });
    */
    Receipt
      .findAll({
        include: {
          model: ReceiptProduct
        }
      })
      .then(function(receipts) {
        if (!receipts) {
          return logger.error("Cannot retrieve users or no users at all.");
        }

        //console.log('receipts', receipts);

        var receiptsPromises = receipts.map(function(receipt) {

          return new Promise(function(resolve2, reject2) {
            var productsPromises = receipt.ReceiptProducts.map(function(product) {
              /*
              return new Promise(function(resolve3, reject3) {
                console.log('raccoon.liked' + '(\'customer' + receipt.customerId.toString() + 'Id\', \''+ product.productId.toString() + '\')');
                raccoon.liked('customer' + receipt.customerId.toString() + 'Id', product.productId.toString(), function() {
                  console.log('Customer ' + receipt.customerId.toString() + ' liked ' + product.productId.toString());
                  resolve3('Customer ' + receipt.customerId.toString() + ' liked ' + product.productId.toString());
                });
              });
              */

                console.log('raccoon.liked' + '(\'customer' + receipt.customerId.toString() + 'Id\', \''+ product.productId.toString() + '\')');
                return raccoon.liked('customer' + receipt.customerId.toString() + 'Id', product.productId.toString());

            });
            Promise.all(productsPromises)
              .then(function(productLikes) {
                console.log('productLikes', productLikes);
                resolve2('Receipt ' + receipt.id.toString() + ' processed.');
              });
          });
        });

        return Promise.all(receiptsPromises);

      })
      .then(function(receiptsProcessed) {
        console.log('receiptsProcessed', receiptsProcessed);
        resolve(receiptsProcessed);
      })
      .catch((e) => {
        logger.error("Cannot retrieve users or no users at all. Error: " + e);
        reject('DB error' + e);
      });
  });
  return successPromise;
};
