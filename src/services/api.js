// API Configuration
// Set USE_LEAN_WEB to true to use real lean-web backend endpoints
// Set to false to use mock endpoints during development
const USE_LEAN_WEB = true;

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
    throw new Error(data.error || 'An error occurred');
  }

  return data;
}

// Response transformers to normalize lean-web responses to expected format
const transformers = {
  // Transform lean-web search results to expected format
  searchResults: (data) => {
    if (!USE_LEAN_WEB) return data;
    // lean-web returns { results: [...], query: "..." }
    return data.results || data;
  },

  // Transform lean-web stakeholders to contacts and guildSmes
  stakeholdersToContacts: (data) => {
    if (!USE_LEAN_WEB) return data;
    // Handle { contacts: [...], guild_smes: [...] } format from lean-web
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

  stakeholdersToGuildSmes: (data) => {
    if (!USE_LEAN_WEB) return data;
    const guildSmes = Array.isArray(data) ? data : (data.guild_smes || []);
    if (!Array.isArray(guildSmes)) return [];
    return guildSmes.map(s => ({
      id: s.id || s.stakeholder_id,
      name: s.name,
      email: s.email,
      role: s.role,
    }));
  },

  // Transform lean-web Jira projects to backlogs format
  jiraProjectsToBacklogs: (data) => {
    if (!USE_LEAN_WEB) return data;
    const projects = data.projects || data;
    return projects.map(p => ({
      id: p.project_key || p.key,
      projectKey: p.project_key || p.key,
      name: p.name || p.project_name,
      url: p.url || `https://jira.example.com/browse/${p.project_key || p.key}`,
    }));
  },

  // Transform lean-web versions to fix versions format
  versionsToFixVersions: (data) => {
    if (!USE_LEAN_WEB) return data;
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

  // Transform lean-web service instances
  serviceInstances: (data) => {
    if (!USE_LEAN_WEB) return data;
    if (!data) return [];
    return data.instances || data || [];
  },

  // Transform lean-web work items to risk stories format
  workItemsToRiskStories: (data) => {
    if (!USE_LEAN_WEB) return data;
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
// Note: Products endpoints need v2 API in lean-web (currently a gap)
export const productsApi = {
  getAll: () => request('/v2/products/'),
  getById: (id) => request(`/v2/products/${id}/`),
  create: (product) => request('/v2/products/', { method: 'POST', body: product }),
  update: (id, product) => request(`/v2/products/${id}/`, { method: 'PUT', body: product }),
  delete: (id) => request(`/v2/products/${id}/`, { method: 'DELETE' }),
  getApps: (productId) => request(`/v2/products/${productId}/apps/`),
  addApp: (productId, appId) => request(`/v2/products/${productId}/apps/${appId}/`, { method: 'POST' }),
  removeApp: (productId, appId) => request(`/v2/products/${productId}/apps/${appId}/`, { method: 'DELETE' }),
};

// Apps API
export const appsApi = {
  // Note: getAll and getById need v2 API in lean-web (currently a gap)
  getAll: () => request('/v2/apps/'),
  getById: (id) => request(`/v2/apps/${id}/`),
  create: (app) => request('/v2/apps/', { method: 'POST', body: app }),
  update: (id, app) => request(`/v2/apps/${id}/`, { method: 'PUT', body: app }),
  // Uses existing lean-web endpoint
  search: (query) => request(`/search/applications/?q=${encodeURIComponent(query)}`).then(transformers.searchResults),
  // Uses existing lean-web endpoint
  getServiceInstances: (appId) => request(`/release/${appId}/service-instances/`)
    .then(transformers.serviceInstances)
    .catch(() => []),
};

// Repos API
// Note: Repos endpoints need v2 API in lean-web (currently a gap)
export const reposApi = {
  getByApp: (appId) => request(`/v2/apps/${appId}/repos/`),
  getAvailable: (appId) => request(`/v2/apps/${appId}/available-repos/`),
  create: (appId, repo) => request(`/v2/apps/${appId}/repos/`, { method: 'POST', body: repo }),
  update: (id, repo) => request(`/v2/repos/${id}/`, { method: 'PUT', body: repo }),
  delete: (id) => request(`/v2/repos/${id}/`, { method: 'DELETE' }),
};

// Backlogs API (Jira Projects)
export const backlogsApi = {
  // Uses existing lean-web endpoint
  getByApp: (appId) => request(`/jira/projects/${appId}/`).then(transformers.jiraProjectsToBacklogs),
  // Note: Create/Update/Delete need v2 API in lean-web (currently a gap)
  create: (appId, backlog) => request(`/v2/apps/${appId}/backlogs/`, { method: 'POST', body: backlog }),
  update: (id, backlog) => request(`/v2/backlogs/${id}/`, { method: 'PUT', body: backlog }),
  delete: (id) => request(`/v2/backlogs/${id}/`, { method: 'DELETE' }),
};

// Contacts API (Stakeholders in lean-web)
export const contactsApi = {
  // Uses existing lean-web endpoint
  getByApp: (appId) => request(`/app/${appId}/stakeholders/`).then(transformers.stakeholdersToContacts),
  create: (appId, contact) => request(`/app/${appId}/stakeholders/`, { method: 'POST', body: contact }),
  update: (appId, id, contact) => request(`/app/${appId}/stakeholders/${id}/`, { method: 'PUT', body: contact }),
  delete: (appId, id) => request(`/app/${appId}/stakeholders/${id}/`, { method: 'DELETE' }),
};

// Guild SMEs API (uses same stakeholders endpoint with stakeholder_type: "guild_sme")
export const guildSmesApi = {
  getByApp: (appId) => request(`/app/${appId}/stakeholders/`).then(transformers.stakeholdersToGuildSmes),
  create: (appId, guildSme) => request(`/app/${appId}/stakeholders/`, { method: 'POST', body: guildSme }),
  delete: (appId, id) => request(`/app/${appId}/stakeholders/${id}/`, { method: 'DELETE' }),
};

// Docs API
// Note: Docs endpoints need v2 API in lean-web (currently a gap)
export const docsApi = {
  getByApp: (appId) => request(`/v2/apps/${appId}/docs/`),
  create: (appId, doc) => request(`/v2/apps/${appId}/docs/`, { method: 'POST', body: doc }),
  update: (id, doc) => request(`/v2/docs/${id}/`, { method: 'PUT', body: doc }),
  delete: (id) => request(`/v2/docs/${id}/`, { method: 'DELETE' }),
};

// Lines of Business API
// Note: Needs v2 API in lean-web (currently a gap)
export const linesOfBusinessApi = {
  getAll: () => request('/v2/lines-of-business/'),
};

// Risk Stories API (Work Items in lean-web)
export const riskStoriesApi = {
  // Uses existing lean-web endpoint
  getByApp: (appId) => request(`/work-items/${appId}/`).then(transformers.workItemsToRiskStories),
  create: (appId, data) => request(`/work-items/${appId}/create/`, { method: 'POST', body: data }),
  // Note: Update needs v2 API in lean-web (currently a gap)
  update: (id, data) => request(`/v2/risk-stories/${id}/`, { method: 'PUT', body: data }),
};

// Business Outcomes API
export const outcomesApi = {
  // Uses existing lean-web endpoint (needs project key and version)
  getByApp: (appId, projectKey, version) =>
    request(`/jira/version-bos/${projectKey}/${version}/`),
  // Search business outcomes
  search: (appId, query) => request(`/bo/${appId}/search/?q=${encodeURIComponent(query)}`),
  // Note: Engagement endpoints need v2 API in lean-web (currently a gap)
  getEngagement: (id) => request(`/v2/outcomes/${id}/engagement/`),
  saveEngagement: (id, data) => request(`/v2/outcomes/${id}/engagement/`, { method: 'PUT', body: data }),
};

// Guilds API
export const guildsApi = {
  // Note: Guilds endpoints need v2 API in lean-web (currently a gap)
  getAll: () => request('/v2/guilds/'),
  getByApp: (appId) => request(`/v2/apps/${appId}/guild-assignments/`),
  // Uses existing lean-web endpoint for control details by guild
  getControls: (appId, guild, status) => request(`/controls/${appId}/${guild}/${status}/`),
};

// Deployments API
export const deploymentsApi = {
  // Uses existing lean-web endpoint
  getFixVersions: (projectKey) => request(`/jira/project-versions/${projectKey}/`).then(transformers.versionsToFixVersions),
  // Uses existing lean-web endpoint
  getEnvironments: (appId) => request(`/release/${appId}/service-instances/`)
    .then(data => data.by_environment || {})
    .catch(() => ({})),
  // Uses existing lean-web endpoint
  create: (releaseId, data) => request(`/release/${releaseId}/deploy/`, { method: 'POST', body: data }),
  // Get release gate status
  getGateStatus: (releaseId) => request(`/release/${releaseId}/gate-status/`),
  // Create a new release
  createRelease: (appId, data) => request(`/application/${appId}/release/create/`, { method: 'POST', body: data }),
};
