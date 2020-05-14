const nextHandlerWrapper = app => {
  const handler = app.getRequestHandler();
  return async ({raw, url}, h) => {
    await handler(raw.req, raw.res, url);
    return h.close;
  };
};

const defaultHandlerWrapper = app => async ({raw: {req, res}, url}, h) => {
  const {pathname, query} = url;

  // Readiness
  if (pathname === '/-/readiness' || pathname === '/-/readiness/') {
    return {
      ready: true,
      app: 'fe'
    };
  }

  // Livenexx
  if (pathname === '/-/liveness' || pathname === '/-/liveness/') {
    return {
      live: true,
      app: 'fe'
    };
  }

  return app.renderToHTML(req, res, pathname, query);
};

const pathWrapper = (app, pathName, opts) => async ({raw, query, params}) => {
  return app.renderToHTML(
    raw.req,
    raw.res,
    pathName,
    {...query, ...params},
    opts
  );
};

module.exports = {pathWrapper, defaultHandlerWrapper, nextHandlerWrapper};
