import { rest } from 'msw';
import { store } from '../store';

export const docsHandlers = [
  rest.get('/api/apps/:appId/docs', (req, res, ctx) => {
    const appDocs = store.docs.filter(d => d.appId === req.params.appId);
    return res(ctx.json(appDocs));
  }),

  rest.post('/api/apps/:appId/docs', (req, res, ctx) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    store.docs.push(newDoc);
    return res(ctx.status(201), ctx.json(newDoc));
  }),

  rest.put('/api/docs/:id', (req, res, ctx) => {
    const index = store.docs.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Doc not found' }));
    }
    store.docs[index] = { ...store.docs[index], ...req.body };
    return res(ctx.json(store.docs[index]));
  }),

  rest.delete('/api/docs/:id', (req, res, ctx) => {
    const index = store.docs.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Doc not found' }));
    }
    store.docs.splice(index, 1);
    return res(ctx.status(204));
  }),
];
