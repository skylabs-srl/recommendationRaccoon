module.exports = (app) => {
  var customer = app.ctrls.customer;

  return {
    endpoints: [{
      method: 'GET',
      path: '/api/customers',
      config: customer.query
    }]
  };
};
