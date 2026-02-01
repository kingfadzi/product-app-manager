import { useCallback, useEffect, useState } from 'react';

function useAsyncSearch(searchFn, minChars = 2) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    if (searchTerm.length < minChars) {
      setResults([]);
      setLoading(false);
      setError(null);
      return () => {
        isActive = false;
      };
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchFn(searchTerm);
        if (!isActive) return;
        setResults(data || []);
      } catch (err) {
        if (!isActive) return;
        setResults([]);
        setError(err.message || 'Search failed. Please try again.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    run();
    return () => {
      isActive = false;
    };
  }, [searchFn, searchTerm, minChars]);

  const reset = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  }, []);

  return { searchTerm, setSearchTerm, results, loading, error, reset };
}

export default useAsyncSearch;
