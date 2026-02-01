import { request } from './apiClient';

export function searchEndpoint(endpoint, query) {
  const encoded = encodeURIComponent(query);
  return request(`${endpoint}?q=${encoded}`);
}
