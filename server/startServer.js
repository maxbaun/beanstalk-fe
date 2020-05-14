const Hapi = require('hapi');
const next = require('next');
const Boom = require('@hapi/boom');
const axios = require('axios');
const Url = require('url');
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || 5000, 10);
const REDIRECT_TO_WWW = process.env.REDIRECT_TO_WWW;

// If (dev) {
//   require('dotenv').config();
// }

axios.defaults.headers.common.Authorization = process.env.API_KEY;

const app = next({dev, dir: 'src'});

const server = Hapi.server({
  port,
  router: {stripTrailingSlash: true},
  routes: {
    cors: {
      origin: [process.env.ORGINS || '*'],
      additionalHeaders: ['Authorization']
    },
    validate: {
      failAction: async (request, h, err) => {
        if (!dev) {
          // In prod, log a limited error message and throw the default Bad Request error.
          console.error('ValidationError:', err.message);
          throw Boom.badRequest('Invalid request payload input');
        }

        // During development, log and respond with the full error.
        console.error(err);
        throw err;
      }
    }
  }
});

app.prepare().then(async () => {
  try {
    if (REDIRECT_TO_WWW) {
      server.ext('onRequest', (request, h) => {
        let defaultOpts = {https: true};
        let opts = Object.assign(defaultOpts, {www: true});
        let host = request.url.host;
        let protocol = request.url.protocol;
        let redirect = false;

        if (opts.www && !/^www\./.test(host)) {
          host = opts.www ? 'www.' + host : host.replace(/^www\./, '');
          redirect = true;
        }

        if (redirect) {
          const u = Url.format({
            protocol: protocol,
            host: host,
            pathname: request.url.pathname,
            port: request.url.port,
            search: request.url.search
          }).toString();

          return h
            .redirect(u)
            .takeover()
            .permanent();
        }

        return h.continue;
      });
    }

    await server.register([
      // Require('./server/auth'),
      require('./setupRoutes')(app)
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.log('Error starting server');
    console.log(error);
  }
});
