import { rest } from 'msw';
import { store } from '../store';

export const productsHandlers = [
  rest.get('/api/products', (req, res, ctx) => res(ctx.json(store.products))),

  rest.get('/api/products/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = store.products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );
    return res(ctx.json(results));
  }),

  rest.get('/api/products/:id', (req, res, ctx) => {
    const product = store.products.find(p => p.id === req.params.id);
    if (!product) {
      return res(ctx.status(404), ctx.json({ error: 'Product not found' }));
    }
    return res(ctx.json(product));
  }),

  rest.post('/api/products', (req, res, ctx) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...req.body
    };
    store.products.push(newProduct);
    return res(ctx.status(201), ctx.json(newProduct));
  }),

  rest.put('/api/products/:id', (req, res, ctx) => {
    const index = store.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Product not found' }));
    }
    store.products[index] = { ...store.products[index], ...req.body };
    return res(ctx.json(store.products[index]));
  }),

  rest.delete('/api/products/:id', (req, res, ctx) => {
    const index = store.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Product not found' }));
    }
    store.products.splice(index, 1);
    store.productApps = store.productApps.filter(pa => pa.productId !== req.params.id);
    return res(ctx.status(204));
  }),

  rest.get('/api/products/apps/all', (req, res, ctx) => res(ctx.json(store.productApps))),

  rest.get('/api/products/:id/apps', (req, res, ctx) => {
    const associations = store.productApps.filter(pa => pa.productId === req.params.id);
    const appIds = associations.map(pa => pa.appId);
    const productAppsList = store.apps.filter(app => appIds.includes(app.id));
    return res(ctx.json(productAppsList));
  }),

  rest.post('/api/products/:productId/apps/:appId', (req, res, ctx) => {
    const existing = store.productApps.find(
      pa => pa.productId === req.params.productId && pa.appId === req.params.appId
    );
    if (existing) {
      return res(ctx.status(409), ctx.json({ error: 'App already added to product' }));
    }
    const newAssociation = {
      productId: req.params.productId,
      appId: req.params.appId,
      addedAt: new Date().toISOString().split('T')[0]
    };
    store.productApps.push(newAssociation);
    return res(ctx.status(201), ctx.json(newAssociation));
  }),

  rest.delete('/api/products/:productId/apps/:appId', (req, res, ctx) => {
    const index = store.productApps.findIndex(
      pa => pa.productId === req.params.productId && pa.appId === req.params.appId
    );
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Association not found' }));
    }
    store.productApps.splice(index, 1);
    return res(ctx.status(204));
  }),
];
