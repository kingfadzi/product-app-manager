import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for searchable API endpoints with debouncing
 * @param {string} endpoint - API endpoint (will have query appended)
 * @param {number} minChars - Minimum characters before searching (default: 2)
 */
function useSearchableAPI(endpoint, minChars = 2) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm.length < minChars) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${endpoint}?q=${encodeURIComponent(searchTerm)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        setResults([]);
        setLoading(false);
        setError('Search failed. Please try again.');
      });
  }, [searchTerm, endpoint, minChars]);

  const reset = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    reset
  };
}

export default useSearchableAPI;
