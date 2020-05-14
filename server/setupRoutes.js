const {defaultHandlerWrapper, nextHandlerWrapper} = require('./nextWrapper');

const register = app => {
  return async server => {
    server.route({
      method: 'GET',
      path: '/_next/{p*}' /* next specific routes */,
      handler: nextHandlerWrapper(app),
      config: {
        auth: false
      }
    });

    server.route({
      method: 'GET',
      path: '/static/{p*}' /* use next to handle static files */,
      handler: nextHandlerWrapper(app),
      config: {
        auth: false
      }
    });

    server.route({
      method: 'GET',
      path: '/{p*}' /* catch all route */,
      config: {
        auth: false
      },
      handler: defaultHandlerWrapper(app)
    });
  };
};

module.exports = app => {
  return {
    name: 'setup-routes',
    version: '1.0.0',
    register: register(app)
  };
};
