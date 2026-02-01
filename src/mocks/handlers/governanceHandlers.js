import { rest } from 'msw';
import { store } from '../store';

const emptyEngagement = {
  productDeltaDoc: '',
  architectureDeltaDoc: '',
  serviceVisionDeltaDoc: '',
  questionnaire: {
    impactsData: '',
    impactsSecurity: '',
    impactsAccessibility: '',
    requiresArchReview: '',
    deploymentStrategy: ''
  },
  selectedGuilds: []
};

export const governanceHandlers = [
  rest.get('/api/outcomes/:outcomeId/engagement', (req, res, ctx) => {
    const engagement = store.outcomeEngagements[req.params.outcomeId];
    if (!engagement) {
      return res(ctx.json(emptyEngagement));
    }
    return res(ctx.json(engagement));
  }),

  rest.put('/api/outcomes/:outcomeId/engagement', (req, res, ctx) => {
    store.outcomeEngagements[req.params.outcomeId] = req.body;
    return res(ctx.json(store.outcomeEngagements[req.params.outcomeId]));
  }),

  rest.get('/api/apps/:appId/risk-stories', (req, res, ctx) => {
    const appRiskStories = store.riskStories[req.params.appId] || [];
    return res(ctx.json(appRiskStories));
  }),

  rest.post('/api/apps/:appId/risk-stories', (req, res, ctx) => {
    const newStory = {
      id: `RISK-${Date.now()}`,
      updated: new Date().toISOString(),
      ...req.body
    };
    if (!store.riskStories[req.params.appId]) {
      store.riskStories[req.params.appId] = [];
    }
    store.riskStories[req.params.appId].push(newStory);
    return res(ctx.status(201), ctx.json(newStory));
  }),

  rest.put('/api/risk-stories/:id', (req, res, ctx) => {
    for (const appId of Object.keys(store.riskStories)) {
      const index = store.riskStories[appId].findIndex(r => r.id === req.params.id);
      if (index !== -1) {
        store.riskStories[appId][index] = {
          ...store.riskStories[appId][index],
          ...req.body,
          updated: new Date().toISOString()
        };
        return res(ctx.json(store.riskStories[appId][index]));
      }
    }
    return res(ctx.status(404), ctx.json({ error: 'Risk story not found' }));
  }),

  rest.get('/api/apps/:appId/outcomes', (req, res, ctx) => {
    const appOutcomes = store.businessOutcomes[req.params.appId] || [];
    return res(ctx.json(appOutcomes));
  }),

  rest.get('/api/v2/apps/:appId/business-outcomes', (req, res, ctx) => {
    const appOutcomes = store.businessOutcomes[req.params.appId] || [];
    return res(ctx.json(appOutcomes));
  }),

  rest.get('/api/v2/apps/:appId/risk-stories', (req, res, ctx) => {
    const appRiskStories = store.riskStories[req.params.appId] || [];
    return res(ctx.json(appRiskStories));
  }),

  rest.post('/api/v2/apps/:appId/sync-governance', (req, res, ctx) => {
    return res(
      ctx.delay(1500),
      ctx.json({ success: true, synced: { business_outcomes: 3, risk_stories: 2 } })
    );
  }),

  rest.get('/api/guilds', (req, res, ctx) => res(ctx.json(store.guilds))),

  rest.get('/api/apps/:appId/guild-assignments', (req, res, ctx) => {
    const appSmes = store.controlSmes[req.params.appId] || [];
    return res(ctx.json(appSmes));
  }),

  rest.get('/api/apps/:appId/guild-smes', (req, res, ctx) => {
    const appSmes = store.controlSmes[req.params.appId] || [];
    const transformed = appSmes.map(sme => ({
      id: sme.id,
      name: sme.name,
      email: sme.email,
      role: sme.guild.toLowerCase().replace(/[.\s]/g, '_'),
      guild: sme.guild,
      health: sme.health,
      blocked: sme.blocked,
    }));
    return res(ctx.json(transformed));
  }),

  rest.post('/api/apps/:appId/guild-smes', (req, res, ctx) => {
    const appId = req.params.appId;
    if (!store.controlSmes[appId]) {
      store.controlSmes[appId] = [];
    }
    const newSme = {
      id: Date.now(),
      ...req.body
    };
    store.controlSmes[appId].push(newSme);
    return res(ctx.status(201), ctx.json({ success: true, stakeholder_id: newSme.id }));
  }),

  rest.delete('/api/guild-smes/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    for (const appId in store.controlSmes) {
      const index = store.controlSmes[appId].findIndex(s => s.id === id);
      if (index !== -1) {
        store.controlSmes[appId].splice(index, 1);
        return res(ctx.status(204));
      }
    }
    return res(ctx.status(404), ctx.json({ error: 'Not found' }));
  }),
];
