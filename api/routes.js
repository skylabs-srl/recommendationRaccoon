module.exports = (app) => {
  var customer = app.ctrls.customer;

  return {
    endpoints: [{
      method: 'GET',
      path: '/api/customers',
      config: customer.query
    }, {
      method: 'GET',
      path: '/api/customers/{name}',
      config: customer.getRecomendations
    }, {
      method: 'POST',
      path: '/api/customers',
      config: customer.setLiked
    }]
  };
};
