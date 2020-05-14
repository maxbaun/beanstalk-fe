const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
// Const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true'
// });

const plugins = [withSass];

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config();
}

module.exports = withPlugins(plugins, {
  distDir: '../.next',
  publicRuntimeConfig: {
    HOST_SERVER: process.env.HOST_SERVER,
    THINKIFIC_SUBDOMAIN: process.env.THINKIFIC_SUBDOMAIN,
    CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    DISABLE_INTERCOM: process.env.DISABLE_INTERCOM,
    DISABLE_GTAG: process.env.DISABLE_GTAG,
    HOST_PUBLIC_API: process.env.HOST_PUBLIC_API,
    HOST_PUBLIC_GATEWAY: process.env.HOST_PUBLIC_GATEWAY,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    THINKIFIC_HEALTH_CHECK_INTERVAL: process.env.THINKIFIC_HEALTH_CHECK_INTERVAL,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY
  },
  webpackDevMiddleware: config => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    };
    return config;
  }
});
