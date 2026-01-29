import { rest } from 'msw';

// Import mock data
import productsData from './data/products.json';
import appsData from './data/apps.json';
import productAppsData from './data/productApps.json';
import reposData from './data/repos.json';
import backlogsData from './data/backlogs.json';
import contactsData from './data/contacts.json';
import docsData from './data/docs.json';
import portfoliosData from './data/portfolios.json';
import serviceInstancesData from './data/serviceInstances.json';
import availableReposData from './data/availableRepos.json';
import availableJiraData from './data/availableJira.json';
import allReposData from './data/allRepos.json';
import allJiraData from './data/allJira.json';
import outcomeEngagementsData from './data/outcomeEngagements.json';
import linesOfBusinessData from './data/linesOfBusiness.json';
import cmdbAppsData from './data/cmdbApps.json';
import riskStoriesData from './data/riskStories.json';
import businessOutcomesData from './data/businessOutcomes.json';
import controlSmesData from './data/controlSmes.json';
import fixVersionsData from './data/fixVersions.json';
import deploymentEnvironmentsData from './data/deploymentEnvironments.json';
import guildsData from './data/guilds.json';

// In-memory data stores (mutable copies)
let products = [...productsData];
let apps = [...appsData];
let productApps = [...productAppsData];
let repos = [...reposData];
let backlogs = [...backlogsData];
let contacts = [...contactsData];
let docs = [...docsData];
let portfolios = [...portfoliosData];
const serviceInstances = { ...serviceInstancesData };
const availableRepos = { ...availableReposData };
const availableJira = { ...availableJiraData };
const allRepos = [...allReposData];
const allJira = [...allJiraData];
let outcomeEngagements = { ...outcomeEngagementsData };
const linesOfBusiness = [...linesOfBusinessData];
const cmdbApps = [...cmdbAppsData];
let riskStories = { ...riskStoriesData };
let businessOutcomes = { ...businessOutcomesData };
let controlSmes = { ...controlSmesData };
const fixVersions = { ...fixVersionsData };
const deploymentEnvironments = [...deploymentEnvironmentsData];
const guilds = [...guildsData];
let deployments = [];

export const handlers = [
  // Products
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json(products));
  }),

  rest.get('/api/products/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );
    return res(ctx.json(results));
  }),

  rest.get('/api/products/:id', (req, res, ctx) => {
    const product = products.find(p => p.id === req.params.id);
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
    products.push(newProduct);
    return res(ctx.status(201), ctx.json(newProduct));
  }),

  rest.put('/api/products/:id', (req, res, ctx) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Product not found' }));
    }
    products[index] = { ...products[index], ...req.body };
    return res(ctx.json(products[index]));
  }),

  rest.delete('/api/products/:id', (req, res, ctx) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Product not found' }));
    }
    products.splice(index, 1);
    // Also remove product-app associations
    productApps = productApps.filter(pa => pa.productId !== req.params.id);
    return res(ctx.status(204));
  }),

  // Product Apps (associations)
  rest.get('/api/products/:id/apps', (req, res, ctx) => {
    const associations = productApps.filter(pa => pa.productId === req.params.id);
    const appIds = associations.map(pa => pa.appId);
    const productAppsList = apps.filter(app => appIds.includes(app.id));
    return res(ctx.json(productAppsList));
  }),

  rest.post('/api/products/:productId/apps/:appId', (req, res, ctx) => {
    const existing = productApps.find(
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
    productApps.push(newAssociation);
    return res(ctx.status(201), ctx.json(newAssociation));
  }),

  rest.delete('/api/products/:productId/apps/:appId', (req, res, ctx) => {
    const index = productApps.findIndex(
      pa => pa.productId === req.params.productId && pa.appId === req.params.appId
    );
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Association not found' }));
    }
    productApps.splice(index, 1);
    return res(ctx.status(204));
  }),

  // Apps
  rest.get('/api/apps', (req, res, ctx) => {
    return res(ctx.json(apps));
  }),

  rest.get('/api/apps/:id', (req, res, ctx) => {
    const app = apps.find(a => a.id === req.params.id);
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
    apps.push(newApp);
    return res(ctx.status(201), ctx.json(newApp));
  }),

  rest.put('/api/apps/:id', (req, res, ctx) => {
    const index = apps.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'App not found' }));
    }
    apps[index] = { ...apps[index], ...req.body };
    return res(ctx.json(apps[index]));
  }),

  // CMDB Search (simulated) - returns all matching apps with product membership info
  rest.get('/api/cmdb/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';

    // Search all CMDB apps (no exclusion)
    const results = cmdbApps.filter(a =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.cmdbId.toLowerCase().includes(query.toLowerCase())
    );

    // Enrich with product membership info
    const enriched = results.map(cmdbApp => {
      // Find if this app is already onboarded
      const onboardedApp = apps.find(a => a.cmdbId === cmdbApp.cmdbId);
      if (onboardedApp) {
        // Get all products this app belongs to
        const appProducts = productApps
          .filter(pa => pa.appId === onboardedApp.id)
          .map(pa => {
            const product = products.find(p => p.id === pa.productId);
            return product ? { id: product.id, name: product.name } : null;
          })
          .filter(Boolean);

        return {
          ...cmdbApp,
          isOnboarded: true,
          onboardedAppId: onboardedApp.id,
          memberOfProducts: appProducts
        };
      }
      return { ...cmdbApp, isOnboarded: false, memberOfProducts: [] };
    });

    return res(ctx.json(enriched));
  }),

  // App Repos
  rest.get('/api/apps/:appId/repos', (req, res, ctx) => {
    const appRepos = repos.filter(r => r.appId === req.params.appId);
    return res(ctx.json(appRepos));
  }),

  rest.post('/api/apps/:appId/repos', (req, res, ctx) => {
    const newRepo = {
      id: `repo-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    repos.push(newRepo);
    return res(ctx.status(201), ctx.json(newRepo));
  }),

  rest.put('/api/repos/:id', (req, res, ctx) => {
    const index = repos.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Repo not found' }));
    }
    repos[index] = { ...repos[index], ...req.body };
    return res(ctx.json(repos[index]));
  }),

  rest.delete('/api/repos/:id', (req, res, ctx) => {
    const index = repos.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Repo not found' }));
    }
    repos.splice(index, 1);
    return res(ctx.status(204));
  }),

  // App Backlogs
  rest.get('/api/apps/:appId/backlogs', (req, res, ctx) => {
    const appBacklogs = backlogs.filter(b => b.appId === req.params.appId);
    return res(ctx.json(appBacklogs));
  }),

  rest.post('/api/apps/:appId/backlogs', (req, res, ctx) => {
    const newBacklog = {
      id: `backlog-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    backlogs.push(newBacklog);
    return res(ctx.status(201), ctx.json(newBacklog));
  }),

  rest.put('/api/backlogs/:id', (req, res, ctx) => {
    const index = backlogs.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Backlog not found' }));
    }
    backlogs[index] = { ...backlogs[index], ...req.body };
    return res(ctx.json(backlogs[index]));
  }),

  rest.delete('/api/backlogs/:id', (req, res, ctx) => {
    const index = backlogs.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Backlog not found' }));
    }
    backlogs.splice(index, 1);
    return res(ctx.status(204));
  }),

  // App Contacts
  rest.get('/api/apps/:appId/contacts', (req, res, ctx) => {
    const appContacts = contacts.filter(c => c.appId === req.params.appId);
    return res(ctx.json(appContacts));
  }),

  rest.post('/api/apps/:appId/contacts', (req, res, ctx) => {
    const newContact = {
      id: `contact-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    contacts.push(newContact);
    return res(ctx.status(201), ctx.json(newContact));
  }),

  rest.put('/api/contacts/:id', (req, res, ctx) => {
    const index = contacts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Contact not found' }));
    }
    contacts[index] = { ...contacts[index], ...req.body };
    return res(ctx.json(contacts[index]));
  }),

  rest.delete('/api/contacts/:id', (req, res, ctx) => {
    const index = contacts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Contact not found' }));
    }
    contacts.splice(index, 1);
    return res(ctx.status(204));
  }),

  // App Docs
  rest.get('/api/apps/:appId/docs', (req, res, ctx) => {
    const appDocs = docs.filter(d => d.appId === req.params.appId);
    return res(ctx.json(appDocs));
  }),

  rest.post('/api/apps/:appId/docs', (req, res, ctx) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      appId: req.params.appId,
      ...req.body
    };
    docs.push(newDoc);
    return res(ctx.status(201), ctx.json(newDoc));
  }),

  rest.put('/api/docs/:id', (req, res, ctx) => {
    const index = docs.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Doc not found' }));
    }
    docs[index] = { ...docs[index], ...req.body };
    return res(ctx.json(docs[index]));
  }),

  rest.delete('/api/docs/:id', (req, res, ctx) => {
    const index = docs.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Doc not found' }));
    }
    docs.splice(index, 1);
    return res(ctx.status(204));
  }),

  // Portfolios
  rest.get('/api/portfolios', (req, res, ctx) => {
    return res(ctx.json(portfolios));
  }),

  rest.get('/api/portfolios/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = portfolios.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase())
    );
    return res(ctx.json(results));
  }),

  // Service Instances (per app from CMDB/DSI)
  rest.get('/api/apps/:appId/service-instances', (req, res, ctx) => {
    const appInstances = serviceInstances[req.params.appId] || [];
    return res(ctx.json(appInstances));
  }),

  // Available Repos (from DSI component mapping)
  rest.get('/api/apps/:appId/available-repos', (req, res, ctx) => {
    const appRepos = availableRepos[req.params.appId] || [];
    return res(ctx.json(appRepos));
  }),

  // Available Jira Projects (from DSI component mapping)
  rest.get('/api/apps/:appId/available-jira', (req, res, ctx) => {
    const appJira = availableJira[req.params.appId] || [];
    return res(ctx.json(appJira));
  }),

  // Global Repo Search (by slug or name)
  rest.get('/api/repos/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = allRepos.filter(r =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.repoId.toLowerCase().includes(query.toLowerCase())
    );
    return res(ctx.json(results));
  }),

  // Global Jira Project Search (by key or name)
  rest.get('/api/jira/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q') || '';
    const results = allJira.filter(j =>
      j.projectKey.toLowerCase().includes(query.toLowerCase()) ||
      j.projectName.toLowerCase().includes(query.toLowerCase())
    );
    return res(ctx.json(results));
  }),

  // Business Outcome Engagements
  rest.get('/api/outcomes/:outcomeId/engagement', (req, res, ctx) => {
    const engagement = outcomeEngagements[req.params.outcomeId];
    if (!engagement) {
      // Return empty engagement structure if not found
      return res(ctx.json({
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
      }));
    }
    return res(ctx.json(engagement));
  }),

  rest.put('/api/outcomes/:outcomeId/engagement', (req, res, ctx) => {
    outcomeEngagements[req.params.outcomeId] = req.body;
    return res(ctx.json(outcomeEngagements[req.params.outcomeId]));
  }),

  // Lines of Business
  rest.get('/api/lines-of-business', (req, res, ctx) => {
    return res(ctx.json(linesOfBusiness));
  }),

  // Risk Stories
  rest.get('/api/apps/:appId/risk-stories', (req, res, ctx) => {
    const appRiskStories = riskStories[req.params.appId] || [];
    return res(ctx.json(appRiskStories));
  }),

  rest.post('/api/apps/:appId/risk-stories', (req, res, ctx) => {
    const newStory = {
      id: `RISK-${Date.now()}`,
      updated: new Date().toISOString(),
      ...req.body
    };
    if (!riskStories[req.params.appId]) {
      riskStories[req.params.appId] = [];
    }
    riskStories[req.params.appId].push(newStory);
    return res(ctx.status(201), ctx.json(newStory));
  }),

  rest.put('/api/risk-stories/:id', (req, res, ctx) => {
    for (const appId of Object.keys(riskStories)) {
      const index = riskStories[appId].findIndex(r => r.id === req.params.id);
      if (index !== -1) {
        riskStories[appId][index] = { ...riskStories[appId][index], ...req.body, updated: new Date().toISOString() };
        return res(ctx.json(riskStories[appId][index]));
      }
    }
    return res(ctx.status(404), ctx.json({ error: 'Risk story not found' }));
  }),

  // Business Outcomes
  rest.get('/api/apps/:appId/outcomes', (req, res, ctx) => {
    const appOutcomes = businessOutcomes[req.params.appId] || [];
    return res(ctx.json(appOutcomes));
  }),

  // Guilds
  rest.get('/api/guilds', (req, res, ctx) => {
    return res(ctx.json(guilds));
  }),

  rest.get('/api/apps/:appId/guild-assignments', (req, res, ctx) => {
    const appSmes = controlSmes[req.params.appId] || [];
    return res(ctx.json(appSmes));
  }),

  // Guild SMEs (for Guilds tab in Governance card)
  rest.get('/api/apps/:appId/guild-smes', (req, res, ctx) => {
    const appSmes = controlSmes[req.params.appId] || [];
    // Transform guild field to role for consistency with backend format
    const transformed = appSmes.map(sme => ({
      id: sme.id,
      name: sme.name,
      email: sme.email,
      role: sme.guild.toLowerCase().replace(/[.\s]/g, '_'),
    }));
    return res(ctx.json(transformed));
  }),

  rest.post('/api/apps/:appId/guild-smes', (req, res, ctx) => {
    const appId = req.params.appId;
    if (!controlSmes[appId]) {
      controlSmes[appId] = [];
    }
    const newSme = {
      id: Date.now(),
      ...req.body
    };
    controlSmes[appId].push(newSme);
    return res(ctx.status(201), ctx.json({ success: true, stakeholder_id: newSme.id }));
  }),

  rest.delete('/api/guild-smes/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id);
    for (const appId in controlSmes) {
      const index = controlSmes[appId].findIndex(s => s.id === id);
      if (index !== -1) {
        controlSmes[appId].splice(index, 1);
        return res(ctx.status(204));
      }
    }
    return res(ctx.status(404), ctx.json({ error: 'Not found' }));
  }),

  // Deployments
  rest.get('/api/backlogs/:projectKey/fix-versions', (req, res, ctx) => {
    const versions = fixVersions[req.params.projectKey] || [];
    return res(ctx.json(versions));
  }),

  rest.get('/api/deployment-environments', (req, res, ctx) => {
    return res(ctx.json(deploymentEnvironments));
  }),

  rest.post('/api/deployments', (req, res, ctx) => {
    const newDeployment = {
      id: `deploy-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    deployments.push(newDeployment);
    return res(ctx.status(201), ctx.json(newDeployment));
  }),
];
