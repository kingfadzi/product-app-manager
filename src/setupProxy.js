const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Skip proxy when using MSW mocks
  if (process.env.REACT_APP_USE_MOCK === 'true') {
    console.log('[Proxy] Disabled - using MSW mocks');
    return;
  }

  const target = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  console.log(`[Proxy] Forwarding /api to ${target}`);

  app.use(
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathFilter: '/api',
    })
  );
};
