import { rest } from 'msw';
import { store } from '../store';

export const miscHandlers = [
  rest.get('/api/portfolios', (req, res, ctx) => res(ctx.json(store.portfolios))),

  rest.get('/api/portfolios/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = store.portfolios.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );
    return res(ctx.json(results));
  }),

  rest.get('/api/apps/:appId/service-instances', (req, res, ctx) => {
    const appId = req.params.appId;
    return res(ctx.json(store.serviceInstances[appId] || []));
  }),

  rest.get('/api/transaction-cycles', (req, res, ctx) => res(ctx.json(store.transactionCycles))),
];
