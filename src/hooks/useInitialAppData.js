import { useEffect, useState, useCallback } from 'react';
import { productsApi, appsApi } from '../services/api';

async function fetchInitialData({ setProducts, setApps, setProductApps }) {
  const [productsData, appsData, allAssociations] = await Promise.all([
    productsApi.getAll(),
    appsApi.getAll(),
    productsApi.getAllProductApps(),
  ]);
  setProducts(productsData);
  setApps(appsData);
  setProductApps(allAssociations);
}

function useInitialAppData({ setProducts, setApps, setProductApps }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchInitialData({ setProducts, setApps, setProductApps });
    } catch (err) {
      setError(err.message || 'Failed to load application data.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setProducts, setApps, setProductApps]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchInitialData({ setProducts, setApps, setProductApps });
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load application data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [setProducts, setApps, setProductApps]);

  return { loading, error, reload: load };
}

export default useInitialAppData;
