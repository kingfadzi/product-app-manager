import { useCallback, useState } from 'react';
import { deploymentsApi } from '../services/api';

function useAppProfileFixVersions({ setError }) {
  const [fixVersions, setFixVersions] = useState({});

  const loadFixVersions = useCallback(async (projectKey) => {
    try {
      const versions = await deploymentsApi.getFixVersions(projectKey);
      setFixVersions(prev => ({ ...prev, [projectKey]: versions }));
    } catch (err) {
      setError(err.message || 'Failed to load fix versions.');
    }
  }, [setError]);

  return { fixVersions, loadFixVersions };
}

export default useAppProfileFixVersions;
