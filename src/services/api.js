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

// Products API
export const productsApi = {
  getAll: () => request('/products'),
  getById: (id) => request(`/products/${id}`),
  create: (product) => request('/products', { method: 'POST', body: product }),
  update: (id, product) => request(`/products/${id}`, { method: 'PUT', body: product }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  getApps: (productId) => request(`/products/${productId}/apps`),
  addApp: (productId, appId) => request(`/products/${productId}/apps/${appId}`, { method: 'POST' }),
  removeApp: (productId, appId) => request(`/products/${productId}/apps/${appId}`, { method: 'DELETE' }),
};

// Apps API
export const appsApi = {
  getAll: () => request('/apps'),
  getById: (id) => request(`/apps/${id}`),
  create: (app) => request('/apps', { method: 'POST', body: app }),
  update: (id, app) => request(`/apps/${id}`, { method: 'PUT', body: app }),
  search: (query) => request(`/cmdb/search?q=${encodeURIComponent(query)}`),
};

// Repos API
export const reposApi = {
  getByApp: (appId) => request(`/apps/${appId}/repos`),
  create: (appId, repo) => request(`/apps/${appId}/repos`, { method: 'POST', body: repo }),
  update: (id, repo) => request(`/repos/${id}`, { method: 'PUT', body: repo }),
  delete: (id) => request(`/repos/${id}`, { method: 'DELETE' }),
};

// Backlogs API
export const backlogsApi = {
  getByApp: (appId) => request(`/apps/${appId}/backlogs`),
  create: (appId, backlog) => request(`/apps/${appId}/backlogs`, { method: 'POST', body: backlog }),
  update: (id, backlog) => request(`/backlogs/${id}`, { method: 'PUT', body: backlog }),
  delete: (id) => request(`/backlogs/${id}`, { method: 'DELETE' }),
};

// Contacts API
export const contactsApi = {
  getByApp: (appId) => request(`/apps/${appId}/contacts`),
  create: (appId, contact) => request(`/apps/${appId}/contacts`, { method: 'POST', body: contact }),
  update: (id, contact) => request(`/contacts/${id}`, { method: 'PUT', body: contact }),
  delete: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),
};

// Docs API
export const docsApi = {
  getByApp: (appId) => request(`/apps/${appId}/docs`),
  create: (appId, doc) => request(`/apps/${appId}/docs`, { method: 'POST', body: doc }),
  update: (id, doc) => request(`/docs/${id}`, { method: 'PUT', body: doc }),
  delete: (id) => request(`/docs/${id}`, { method: 'DELETE' }),
};
