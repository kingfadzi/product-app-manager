import { useEffect, useMemo, useState } from 'react';
import { appsApi, reposApi, backlogsApi } from '../services/api';

const getAppId = (selectedApp) =>
  selectedApp?.cmdbId || selectedApp?.correlation_id || selectedApp?.id || null;

const settledValue = (result) => (result.status === 'fulfilled' ? result.value : []);

const buildRepoList = (gitlabRepos, bitbucketRepos) => [
  ...(gitlabRepos || []),
  ...(bitbucketRepos || []),
];

const resolveResults = (results) => {
  const [instances, gitlabRepos, bitbucketRepos, jira] = results.map(settledValue);
  return {
    instances,
    repos: buildRepoList(gitlabRepos, bitbucketRepos),
    jira,
    hasError: results.some((result) => result.status === 'rejected'),
  };
};

const resetData = (setters) => {
  setters.setServiceInstances([]);
  setters.setAvailableRepos([]);
  setters.setAvailableJira([]);
  setters.setError(null);
  setters.setLoading(false);
};

const loadAppData = async (appId, setters) => {
  setters.setLoading(true);
  setters.setError(null);
  const results = await Promise.allSettled([
    appsApi.getServiceInstances(appId),
    reposApi.getAvailable(appId),
    reposApi.getAvailableBitbucket(appId),
    backlogsApi.getAvailable(appId),
  ]);
  return resolveResults(results);
};

function useWizardDataEffect(selectedApp, setters) {
  useEffect(() => {
    const appId = getAppId(selectedApp);
    if (!appId) {
      resetData(setters);
      return;
    }

    let isActive = true;
    const run = async () => {
      try {
        const { instances, repos, jira, hasError } = await loadAppData(appId, setters);
        if (!isActive) return;
        if (hasError) setters.setError('Failed to load app data. Please try again.');
        setters.setServiceInstances(instances || []);
        setters.setAvailableRepos(repos || []);
        setters.setAvailableJira(jira || []);
      } catch (err) {
        if (!isActive) return;
        setters.setError(err.message || 'Failed to load app data. Please try again.');
        setters.setServiceInstances([]);
        setters.setAvailableRepos([]);
        setters.setAvailableJira([]);
      } finally {
        if (isActive) setters.setLoading(false);
      }
    };

    run();
    return () => {
      isActive = false;
    };
  }, [selectedApp, setters]);
}

function useAddAppWizardData(selectedApp) {
  const [serviceInstances, setServiceInstances] = useState([]);
  const [availableRepos, setAvailableRepos] = useState([]);
  const [availableJira, setAvailableJira] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setters = useMemo(() => ({
    setServiceInstances,
    setAvailableRepos,
    setAvailableJira,
    setLoading,
    setError,
  }), [setServiceInstances, setAvailableRepos, setAvailableJira, setLoading, setError]);

  useWizardDataEffect(selectedApp, setters);
  return { serviceInstances, availableRepos, availableJira, loading, error, setError };
}

export default useAddAppWizardData;
