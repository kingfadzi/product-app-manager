import { useCallback } from 'react';
import { productsApi } from '../services/api';
import useAsyncSearch from './useAsyncSearch';

function useProductSearch(minChars = 2) {
  const searchFn = useCallback((query) => productsApi.search(query), []);
  return useAsyncSearch(searchFn, minChars);
}

export default useProductSearch;
