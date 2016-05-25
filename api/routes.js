module.exports = (app) => {
  var customer = app.ctrls.customer;

  return {
    endpoints: [{
      method: 'GET',
      path: '/api/customers',
      config: customer.query
    }, {
      method: 'GET',
      path: '/api/recommendations/{name}',
      config: customer.getRecommendations
    }, {
      method: 'POST',
      path: '/api/recommendations/like',
      config: customer.setLiked
    }, {
      method: 'POST',
      path: '/api/recommendations/batchlike',
      config: customer.setBatchLiked
    }]
  };
};
