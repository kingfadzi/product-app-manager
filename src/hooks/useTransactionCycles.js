import { useCallback, useEffect, useRef, useState } from 'react';
import { transactionCyclesApi } from '../services/api';

function useTransactionCycles() {
  const [transactionCycles, setTransactionCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionCyclesApi.getAll();
      if (!isMounted.current) return;
      setTransactionCycles(data || []);
    } catch (err) {
      if (!isMounted.current) return;
      setError(err.message || 'Failed to load transaction cycles.');
      setTransactionCycles([]);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      isMounted.current = false;
    };
  }, [load]);

  return { transactionCycles, loading, error, reload: load };
}

export default useTransactionCycles;
