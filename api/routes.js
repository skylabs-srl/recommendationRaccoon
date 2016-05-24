module.exports = (app) => {
    var main = app.ctrls.main;

    return {
        endpoints: [
          {
              method: 'GET',
              path: '/',
              config: main.main
          }
        ]
    };
};
