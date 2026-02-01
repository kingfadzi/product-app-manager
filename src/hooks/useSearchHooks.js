import { useCallback } from 'react';
import { appsApi, productsApi } from '../services/api';
import { searchEndpoint } from '../services/searchApi';
import useAsyncSearch from './useAsyncSearch';

export function useCmdbAppSearch(minChars = 2) {
  const searchFn = useCallback((query) => appsApi.searchCmdb(query), []);
  return useAsyncSearch(searchFn, minChars);
}

export function useProductSearch(minChars = 2) {
  const searchFn = useCallback((query) => productsApi.search(query), []);
  return useAsyncSearch(searchFn, minChars);
}

/**
 * Hook for searchable API endpoints with debouncing
 * @param {string} endpoint - API endpoint (will have query appended)
 * @param {number} minChars - Minimum characters before searching (default: 2)
 */
export function useSearchableAPI(endpoint, minChars = 2) {
  const searchFn = useCallback((query) => searchEndpoint(endpoint, query), [endpoint]);
  return useAsyncSearch(searchFn, minChars);
}
