import { rest } from 'msw';
import { store } from '../store';

export const reposHandlers = [
  rest.get('/api/apps/:appId/repos', (req, res, ctx) => {
    const appRepos = store.repos.filter(r => r.appId === req.params.appId);
    return res(ctx.json(appRepos));
  }),

  rest.post('/api/apps/:appId/repos', (req, res, ctx) => {
    const newRepo = {
      id: `repo-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    store.repos.push(newRepo);
    return res(ctx.status(201), ctx.json(newRepo));
  }),

  rest.put('/api/repos/:id', (req, res, ctx) => {
    const index = store.repos.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Repo not found' }));
    }
    store.repos[index] = { ...store.repos[index], ...req.body };
    return res(ctx.json(store.repos[index]));
  }),

  rest.delete('/api/repos/:id', (req, res, ctx) => {
    const index = store.repos.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Repo not found' }));
    }
    store.repos.splice(index, 1);
    return res(ctx.status(204));
  }),

  rest.get('/api/apps/:appId/available-repos', (req, res, ctx) => {
    const appId = req.params.appId;
    return res(ctx.json(store.availableRepos[appId] || []));
  }),

  rest.get('/api/repos/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = store.allRepos.filter(repo =>
      repo.name.toLowerCase().includes(query.toLowerCase()) ||
      repo.slug.toLowerCase().includes(query.toLowerCase())
    );
    return res(ctx.json(results));
  }),
];
