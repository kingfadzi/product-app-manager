import { rest } from 'msw';
import { store } from '../store';

export const backlogsHandlers = [
  rest.get('/api/apps/:appId/backlogs', (req, res, ctx) => {
    const appBacklogs = store.backlogs.filter(b => b.appId === req.params.appId);
    return res(ctx.json(appBacklogs));
  }),

  rest.post('/api/apps/:appId/backlogs', (req, res, ctx) => {
    const newBacklog = {
      id: `backlog-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    store.backlogs.push(newBacklog);
    return res(ctx.status(201), ctx.json(newBacklog));
  }),

  rest.put('/api/backlogs/:id', (req, res, ctx) => {
    const index = store.backlogs.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Backlog not found' }));
    }
    store.backlogs[index] = { ...store.backlogs[index], ...req.body };
    return res(ctx.json(store.backlogs[index]));
  }),

  rest.delete('/api/backlogs/:id', (req, res, ctx) => {
    const index = store.backlogs.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Backlog not found' }));
    }
    store.backlogs.splice(index, 1);
    return res(ctx.status(204));
  }),

  rest.get('/api/apps/:appId/available-jira', (req, res, ctx) => {
    const appId = req.params.appId;
    return res(ctx.json(store.availableJira[appId] || []));
  }),

  rest.get('/api/jira/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = store.allJira.filter(project =>
      project.projectKey.toLowerCase().includes(query.toLowerCase()) ||
      project.projectName.toLowerCase().includes(query.toLowerCase())
    );
    return res(ctx.json(results));
  }),
];
