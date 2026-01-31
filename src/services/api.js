// API Configuration
// Set REACT_APP_USE_MOCK=true in .env to use mock endpoints
// Set REACT_APP_USE_MOCK=false to use real backend endpoints
const USE_MOCK = process.env.REACT_APP_USE_MOCK !== 'false';

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.error || 'An error occurred');
  }

  return data;
}

// Response transformers to normalize backend responses to expected format
// Transformers only run when using real backend (USE_MOCK = false)
const transformers = {
  // Transform backend search results to expected format
  searchResults: (data) => {
    if (USE_MOCK) return data;
    // Backend returns { results: [...], query: "..." }
    return data.results || data;
  },

  // Transform backend search results to CMDB format for AddAppModal
  cmdbSearchResults: (data) => {
    if (USE_MOCK) return data;
    // Backend returns array of apps directly
    const results = data.results || data;
    return results.map(app => ({
      cmdbId: app.cmdbId,
      id: app.cmdbId,
      name: app.name,
      tier: app.tier,
      stack: app.stack,
      productOwner: app.productOwner,
      systemArchitect: app.systemArchitect,
      operationalStatus: app.operationalStatus,
      resilienceCategory: app.resCat,
      transactionCycle: app.transactionCycle,
      transactionCycleId: app.transactionCycleId,
      isOnboarded: app.isOnboarded || false,
      memberOfProducts: app.memberOfProducts || [],
    }));
  },

  // Transform backend stakeholders to contacts
  stakeholdersToContacts: (data) => {
    if (USE_MOCK) return data;
    // Handle { contacts: [...], guild_smes: [...] } format from backend
    const stakeholders = Array.isArray(data) ? data : (data.contacts || data.stakeholders || []);
    if (!Array.isArray(stakeholders)) return [];
    return stakeholders.map(s => ({
      id: s.id || s.stakeholder_id,
      name: s.name,
      email: s.email,
      role: s.role,
      phone: s.phone || '',
    }));
  },

  // Transform backend stakeholders to guild SMEs
  stakeholdersToGuildSmes: (data) => {
    if (USE_MOCK) return data;
    const guildSmes = Array.isArray(data) ? data : (data.guild_smes || []);
    if (!Array.isArray(guildSmes)) return [];
    return guildSmes.map(s => ({
      id: s.id || s.stakeholder_id,
      name: s.name,
      email: s.email,
      role: s.role,
    }));
  },

  // Transform backend Jira projects to backlogs format
  jiraProjectsToBacklogs: (data) => {
    if (USE_MOCK) return data;
    const projects = data.projects || data;
    return projects.map(p => ({
      id: p.projectKey || p.project_key || p.key,
      projectKey: p.projectKey || p.project_key || p.key,
      projectName: p.projectName || p.project_name || p.name,
      url: p.projectUrl || p.url || `https://jira.example.com/browse/${p.projectKey || p.key}`,
    }));
  },

  // Transform backend versions to fix versions format
  versionsToFixVersions: (data) => {
    if (USE_MOCK) return data;
    const versions = data.versions || data;
    return versions.map(v => ({
      id: v.id || v.name,
      name: v.name,
      releaseDate: v.release_date || v.releaseDate,
      released: v.released || false,
      totalConstraints: v.total_constraints || 0,
      openConstraints: v.open || 0,
    }));
  },

  // Transform backend service instances
  serviceInstances: (data) => {
    if (USE_MOCK) return data;
    if (!data) return [];
    const instances = data.instances || data || [];
    return instances.map(si => ({
      siId: si.id,
      name: si.name,
      environment: si.environment,
      status: si.status,
    }));
  },

  // Transform backend available repos (GitLab)
  availableRepos: (data) => {
    if (USE_MOCK) return data;
    if (!data) return [];
    return data.map(repo => ({
      repoId: repo.gitlabId,
      name: repo.name,
      slug: repo.slug,
      url: repo.url,
      type: 'GitLab',
      defaultBranch: repo.defaultBranch,
      lastActivity: repo.lastActivity,
    }));
  },

  // Transform backend available Bitbucket repos
  availableBitbucketRepos: (data) => {
    if (USE_MOCK) return data;
    if (!data) return [];
    return data.map(repo => ({
      repoId: repo.slug || repo.name,
      name: repo.name,
      slug: repo.slug,
      url: repo.url,
      type: 'Bitbucket',
    }));
  },

  // Transform backend work items to risk stories format
  workItemsToRiskStories: (data) => {
    if (USE_MOCK) return data;
    const items = data.work_items || data;
    return items.map(item => ({
      id: item.ticket_key || item.id,
      ticketKey: item.ticket_key,
      summary: item.summary,
      status: item.status,
      priority: item.priority,
      assignee: item.assignee,
      created: item.created,
    }));
  },
};

// Products API
export const productsApi = {
  getAll: () => request(USE_MOCK ? '/products' : '/v2/products/'),
  getById: (id) => request(USE_MOCK ? `/products/${id}` : `/v2/products/${id}/`),
  create: (product) => request(USE_MOCK ? '/products' : '/v2/products/', { method: 'POST', body: product }),
  update: (id, product) => request(USE_MOCK ? `/products/${id}` : `/v2/products/${id}/`, { method: 'PUT', body: product }),
  delete: (id) => request(USE_MOCK ? `/products/${id}` : `/v2/products/${id}/`, { method: 'DELETE' }),
  getApps: (productId) => request(USE_MOCK ? `/products/${productId}/apps` : `/v2/products/${productId}/apps/`),
  getAllProductApps: () => request(USE_MOCK ? '/products/apps/all' : '/v2/products/apps/all/'),
  addApp: (productId, appId) => request(USE_MOCK ? `/products/${productId}/apps/${appId}` : `/v2/products/${productId}/apps/${appId}/`, { method: 'POST' }),
  removeApp: (productId, appId) => request(USE_MOCK ? `/products/${productId}/apps/${appId}` : `/v2/products/${productId}/apps/${appId}/`, { method: 'DELETE' }),
  search: (query) => request(USE_MOCK ? `/products/search?q=${encodeURIComponent(query)}` : `/v2/products/search/?q=${encodeURIComponent(query)}`),
};

// Apps API
export const appsApi = {
  getAll: () => request(USE_MOCK ? '/apps' : '/v2/apps/'),
  getById: (id) => request(USE_MOCK ? `/apps/${id}` : `/v2/apps/${id}/`),
  create: (app) => request(USE_MOCK ? '/apps' : '/v2/apps/', { method: 'POST', body: app }),
  update: (id, app) => request(USE_MOCK ? `/apps/${id}` : `/v2/apps/${id}/`, { method: 'PUT', body: app }),
  search: (query) => request(USE_MOCK ? `/apps/search?q=${encodeURIComponent(query)}` : `/search/applications/?q=${encodeURIComponent(query)}`).then(transformers.searchResults),
  searchCmdb: (query) => request(USE_MOCK ? `/cmdb/search?q=${encodeURIComponent(query)}` : `/search/applications/?q=${encodeURIComponent(query)}`).then(transformers.cmdbSearchResults),
  getServiceInstances: (appId) => request(USE_MOCK ? `/apps/${appId}/service-instances` : `/release/${appId}/service-instances/`)
    .then(transformers.serviceInstances)
    .catch(() => []),
};

// Repos API
export const reposApi = {
  getByApp: (appId) => request(USE_MOCK ? `/apps/${appId}/repos` : `/v2/apps/${appId}/repos/`),
  getAvailable: (appId) => request(USE_MOCK ? `/apps/${appId}/available-repos` : `/v2/apps/${appId}/available-repos/`).then(transformers.availableRepos),
  getAvailableBitbucket: (appId) => request(USE_MOCK ? `/apps/${appId}/available-bitbucket-repos` : `/v2/apps/${appId}/available-bitbucket-repos/`).then(transformers.availableBitbucketRepos),
  create: (appId, repo) => request(USE_MOCK ? `/apps/${appId}/repos` : `/v2/apps/${appId}/repos/`, { method: 'POST', body: repo }),
  update: (id, repo) => request(USE_MOCK ? `/repos/${id}` : `/v2/repos/${id}/`, { method: 'PUT', body: repo }),
  delete: (id) => request(USE_MOCK ? `/repos/${id}` : `/v2/repos/${id}/`, { method: 'DELETE' }),
};

// Backlogs API (Jira Projects)
export const backlogsApi = {
  getByApp: (appId) => request(USE_MOCK ? `/apps/${appId}/backlogs` : `/v2/apps/${appId}/backlogs/`),
  getAvailable: (appId) => request(USE_MOCK ? `/apps/${appId}/available-jira` : `/jira/projects/${appId}/`).then(transformers.jiraProjectsToBacklogs),
  create: (appId, backlog) => request(USE_MOCK ? `/apps/${appId}/backlogs` : `/v2/apps/${appId}/backlogs/`, { method: 'POST', body: backlog }),
  update: (id, backlog) => request(USE_MOCK ? `/backlogs/${id}` : `/v2/backlogs/${id}/`, { method: 'PUT', body: backlog }),
  delete: (id) => request(USE_MOCK ? `/backlogs/${id}` : `/v2/backlogs/${id}/`, { method: 'DELETE' }),
};

// Contacts API (Stakeholders in lean-web)
export const contactsApi = {
  getByApp: (appId) => request(USE_MOCK ? `/apps/${appId}/contacts` : `/app/${appId}/stakeholders/`).then(transformers.stakeholdersToContacts),
  create: (appId, contact) => request(USE_MOCK ? `/apps/${appId}/contacts` : `/app/${appId}/stakeholders/`, { method: 'POST', body: contact }),
  update: (appId, id, contact) => request(USE_MOCK ? `/contacts/${id}` : `/app/${appId}/stakeholders/${id}/`, { method: 'PUT', body: contact }),
  delete: (appId, id) => request(USE_MOCK ? `/contacts/${id}` : `/app/${appId}/stakeholders/${id}/`, { method: 'DELETE' }),
};

// Guild SMEs API (uses same stakeholders endpoint in lean-web, separate endpoint for mocks)
export const guildSmesApi = {
  getByApp: (appId) => request(USE_MOCK ? `/apps/${appId}/guild-smes` : `/app/${appId}/stakeholders/`).then(transformers.stakeholdersToGuildSmes),
  create: (appId, guildSme) => request(USE_MOCK ? `/apps/${appId}/guild-smes` : `/app/${appId}/stakeholders/`, { method: 'POST', body: guildSme }),
  delete: (appId, id) => request(USE_MOCK ? `/guild-smes/${id}` : `/app/${appId}/stakeholders/${id}/`, { method: 'DELETE' }),
};

// Docs API
export const docsApi = {
  getByApp: (appId) => request(USE_MOCK ? `/apps/${appId}/docs` : `/v2/apps/${appId}/docs/`),
  create: (appId, doc) => request(USE_MOCK ? `/apps/${appId}/docs` : `/v2/apps/${appId}/docs/`, { method: 'POST', body: doc }),
  update: (id, doc) => request(USE_MOCK ? `/docs/${id}` : `/v2/docs/${id}/`, { method: 'PUT', body: doc }),
  delete: (id) => request(USE_MOCK ? `/docs/${id}` : `/v2/docs/${id}/`, { method: 'DELETE' }),
};

// Transaction Cycles API
export const transactionCyclesApi = {
  getAll: () => request(USE_MOCK ? '/transaction-cycles' : '/v2/transaction-cycles/'),
};

// Risk Stories API (Work Items in lean-web)
export const riskStoriesApi = {
  getByApp: (appId) => request(USE_MOCK ? `/apps/${appId}/risk-stories` : `/work-items/${appId}/`).then(transformers.workItemsToRiskStories),
  create: (appId, data) => request(USE_MOCK ? `/apps/${appId}/risk-stories` : `/work-items/${appId}/create/`, { method: 'POST', body: data }),
  update: (id, data) => request(USE_MOCK ? `/risk-stories/${id}` : `/v2/risk-stories/${id}/`, { method: 'PUT', body: data }),
};

// Business Outcomes API
export const outcomesApi = {
  getByApp: (appId, projectKey, version) =>
    request(USE_MOCK ? `/apps/${appId}/outcomes` : `/jira/version-bos/${projectKey}/${version}/`),
  search: (appId, query) => request(USE_MOCK ? `/apps/${appId}/outcomes/search?q=${encodeURIComponent(query)}` : `/bo/${appId}/search/?q=${encodeURIComponent(query)}`),
  getEngagement: (id) => request(USE_MOCK ? `/outcomes/${id}/engagement` : `/v2/outcomes/${id}/engagement/`),
  saveEngagement: (id, data) => request(USE_MOCK ? `/outcomes/${id}/engagement` : `/v2/outcomes/${id}/engagement/`, { method: 'PUT', body: data }),
};

// Guilds API
export const guildsApi = {
  getAll: () => request(USE_MOCK ? '/guilds' : '/v2/guilds/'),
  getByApp: (appId) => request(USE_MOCK ? `/apps/${appId}/guild-assignments` : `/v2/apps/${appId}/guild-assignments/`),
  getControls: (appId, guild, status) => request(USE_MOCK ? `/apps/${appId}/controls/${guild}/${status}` : `/controls/${appId}/${guild}/${status}/`),
};

// Deployments API
export const deploymentsApi = {
  getFixVersions: (projectKey) => request(USE_MOCK ? `/backlogs/${projectKey}/fix-versions` : `/jira/project-versions/${projectKey}/`).then(transformers.versionsToFixVersions),
  getEnvironments: () => request(USE_MOCK ? `/deployment-environments` : `/deployment-environments/`)
    .then(data => Array.isArray(data) ? data : [])
    .catch(() => []),
  create: (releaseId, data) => request(USE_MOCK ? `/releases/${releaseId}/deploy` : `/release/${releaseId}/deploy/`, { method: 'POST', body: data }),
  getGateStatus: (releaseId) => request(USE_MOCK ? `/releases/${releaseId}/gate-status` : `/release/${releaseId}/gate-status/`),
  createRelease: (appId, data) => request(USE_MOCK ? `/apps/${appId}/releases` : `/application/${appId}/release/create/`, { method: 'POST', body: data }),
};
