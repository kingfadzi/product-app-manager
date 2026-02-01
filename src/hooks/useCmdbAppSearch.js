import { useCallback } from 'react';
import { appsApi } from '../services/api';
import useAsyncSearch from './useAsyncSearch';

function useCmdbAppSearch(minChars = 2) {
  const searchFn = useCallback((query) => appsApi.searchCmdb(query), []);
  return useAsyncSearch(searchFn, minChars);
}

export default useCmdbAppSearch;
