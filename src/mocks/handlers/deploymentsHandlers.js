import { rest } from 'msw';
import { store } from '../store';

export const deploymentsHandlers = [
  rest.get('/api/backlogs/:projectKey/fix-versions', (req, res, ctx) => {
    const versions = store.fixVersions[req.params.projectKey] || [];
    return res(ctx.json(versions));
  }),

  rest.get('/api/deployment-environments', (req, res, ctx) => {
    return res(ctx.json(store.deploymentEnvironments));
  }),

  rest.post('/api/deployments', (req, res, ctx) => {
    const newDeployment = {
      id: `deploy-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    store.deployments.push(newDeployment);
    return res(ctx.status(201), ctx.json(newDeployment));
  }),
];
