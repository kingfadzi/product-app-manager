import { rest } from 'msw';
import { store } from '../store';

export const appsHandlers = [
  rest.get('/api/apps', (req, res, ctx) => res(ctx.json(store.apps))),

  rest.get('/api/apps/:id', (req, res, ctx) => {
    const app = store.apps.find(a => a.id === req.params.id);
    if (!app) {
      return res(ctx.status(404), ctx.json({ error: 'App not found' }));
    }
    return res(ctx.json(app));
  }),

  rest.post('/api/apps', (req, res, ctx) => {
    const newApp = {
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...req.body
    };
    store.apps.push(newApp);
    return res(ctx.status(201), ctx.json(newApp));
  }),

  rest.put('/api/apps/:id', (req, res, ctx) => {
    const index = store.apps.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'App not found' }));
    }
    store.apps[index] = { ...store.apps[index], ...req.body };
    return res(ctx.json(store.apps[index]));
  }),

  rest.get('/api/cmdb/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = store.cmdbApps.filter(a =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.cmdbId.toLowerCase().includes(query.toLowerCase())
    );

    const enriched = results.map(cmdbApp => {
      const onboardedApp = store.apps.find(a => a.cmdbId === cmdbApp.cmdbId);
      if (onboardedApp) {
        const appProducts = store.productApps
          .filter(pa => pa.appId === onboardedApp.id)
          .map(pa => {
            const product = store.products.find(p => p.id === pa.productId);
            return product ? { id: product.id, name: product.name } : null;
          })
          .filter(Boolean);
        return {
          ...cmdbApp,
          isOnboarded: true,
          onboardedAppId: onboardedApp.id,
          memberOfProducts: appProducts,
        };
      }
      return {
        ...cmdbApp,
        isOnboarded: false,
        memberOfProducts: [],
      };
    });

    return res(ctx.json(enriched));
  }),
];
