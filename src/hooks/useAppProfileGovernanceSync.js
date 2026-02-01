import { useCallback, useState } from 'react';
import { outcomesApi, riskStoriesApi, syncApi } from '../services/api';

function useAppProfileGovernanceSync({ appId, setRiskStories, setBusinessOutcomes, setError }) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const syncGovernance = useCallback(async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      await syncApi.syncGovernance(appId);
      const [riskData, outcomesData] = await Promise.all([
        riskStoriesApi.getByApp(appId),
        outcomesApi.getByApp(appId),
      ]);
      setRiskStories(riskData || []);
      setBusinessOutcomes(outcomesData || []);
    } catch (err) {
      const message = err.message || 'Failed to sync governance data';
      setSyncError(message);
      setError(message);
    } finally {
      setSyncing(false);
    }
  }, [appId, setBusinessOutcomes, setError, setRiskStories]);

  return { syncGovernance, syncing, syncError };
}

export default useAppProfileGovernanceSync;
