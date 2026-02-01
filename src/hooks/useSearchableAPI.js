import { useCallback } from 'react';
import { searchEndpoint } from '../services/searchApi';
import useAsyncSearch from './useAsyncSearch';

/**
 * Hook for searchable API endpoints with debouncing
 * @param {string} endpoint - API endpoint (will have query appended)
 * @param {number} minChars - Minimum characters before searching (default: 2)
 */
function useSearchableAPI(endpoint, minChars = 2) {
  const searchFn = useCallback((query) => searchEndpoint(endpoint, query), [endpoint]);
  return useAsyncSearch(searchFn, minChars);
}

export default useSearchableAPI;
