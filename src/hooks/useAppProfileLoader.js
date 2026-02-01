import { useCallback, useEffect, useState } from 'react';
import { riskStoriesApi, outcomesApi, guildSmesApi, deploymentsApi } from '../services/api';

const settledValue = (result) => (result.status === 'fulfilled' ? result.value : []);

const resolveResults = (results) => {
  const [
    reposData,
    backlogsData,
    contactsData,
    docsData,
    riskData,
    outcomesData,
    smesData,
    envsData,
  ] = results.map(settledValue);

  return {
    reposData,
    backlogsData,
    contactsData,
    docsData,
    riskData,
    outcomesData,
    smesData,
    envsData,
    hasError: results.some((result) => result.status === 'rejected'),
  };
};

function useAppProfileLoader(appId, fetchers, setError) {
  const [repos, setRepos] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [docs, setDocs] = useState([]);
  const [riskStories, setRiskStories] = useState([]);
  const [businessOutcomes, setBusinessOutcomes] = useState([]);
  const [guildSmes, setGuildSmes] = useState([]);
  const [deploymentEnvironments, setDeploymentEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!appId) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        fetchers.getAppRepos(appId),
        fetchers.getAppBacklogs(appId),
        fetchers.getAppContacts(appId),
        fetchers.getAppDocs(appId),
        riskStoriesApi.getByApp(appId),
        outcomesApi.getByApp(appId),
        guildSmesApi.getByApp(appId),
        deploymentsApi.getEnvironments(),
      ]);

      const resolved = resolveResults(results);
      if (resolved.hasError) {
        setError('Some app profile data failed to load.');
      }

      setRepos(resolved.reposData || []);
      setBacklogs(resolved.backlogsData || []);
      setContacts(resolved.contactsData || []);
      setDocs(resolved.docsData || []);
      setRiskStories(resolved.riskData || []);
      setBusinessOutcomes(resolved.outcomesData || []);
      setGuildSmes(resolved.smesData || []);
      setDeploymentEnvironments(resolved.envsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load app data.');
    } finally {
      setLoading(false);
    }
  }, [appId, fetchers, setError]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    repos,
    backlogs,
    contacts,
    docs,
    riskStories,
    businessOutcomes,
    guildSmes,
    deploymentEnvironments,
    loading,
    setContacts,
    setDocs,
    setGuildSmes,
    setRiskStories,
    setBusinessOutcomes,
  };
}

export default useAppProfileLoader;
