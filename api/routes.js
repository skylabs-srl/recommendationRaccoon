module.exports = (app) => {
  var customer = app.ctrls.customer;
  var recommendation = app.ctrls.recommendation;

  return {
    endpoints: [{
      method: 'GET',
      path: '/api/customers',
      config: customer.query
    }, {
      method: 'GET',
      path: '/api/recommendations/{customerId}',
      config: recommendation.getRecommendations
    }, {
      method: 'POST',
      path: '/api/recommendations/like',
      config: recommendation.setLiked
    }, {
      method: 'POST',
      path: '/api/recommendations/batchlike',
      config: recommendation.setBatchLiked
    }]
  };
};
