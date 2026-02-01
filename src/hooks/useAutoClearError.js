import { useEffect } from 'react';

function useAutoClearError(error, setError, delayMs = 5000) {
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), delayMs);
    return () => clearTimeout(timer);
  }, [error, setError, delayMs]);
}

export default useAutoClearError;
