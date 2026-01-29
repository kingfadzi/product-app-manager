import { useState, useEffect, useCallback } from 'react';
import useApps from '../../../hooks/useApps';
import { riskStoriesApi, outcomesApi, guildsApi, deploymentsApi } from '../../../services/api';

function useAppProfileData(appId) {
  const {
    getAppRepos, getAppBacklogs, getAppContacts, getAppDocs,
    createContact, deleteContact, createDoc, deleteDoc
  } = useApps();

  const [repos, setRepos] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [docs, setDocs] = useState([]);
  const [riskStories, setRiskStories] = useState([]);
  const [businessOutcomes, setBusinessOutcomes] = useState([]);
  const [controlSmes, setControlSmes] = useState([]);
  const [deploymentEnvironments, setDeploymentEnvironments] = useState([]);
  const [fixVersions, setFixVersions] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!appId) return;
    setLoading(true);
    try {
      const [reposData, backlogsData, contactsData, docsData, riskData, outcomesData, smesData, envsData] = await Promise.all([
        getAppRepos(appId),
        getAppBacklogs(appId),
        getAppContacts(appId),
        getAppDocs(appId),
        riskStoriesApi.getByApp(appId),
        outcomesApi.getByApp(appId),
        guildsApi.getByApp(appId),
        deploymentsApi.getEnvironments(),
      ]);
      setRepos(reposData || []);
      setBacklogs(backlogsData || []);
      setContacts(contactsData || []);
      setDocs(docsData || []);
      setRiskStories(riskData || []);
      setBusinessOutcomes(outcomesData || []);
      setControlSmes(smesData || []);
      setDeploymentEnvironments(envsData || []);
    } catch (err) {
      console.error('Error loading app data:', err);
    } finally {
      setLoading(false);
    }
  }, [appId, getAppRepos, getAppBacklogs, getAppContacts, getAppDocs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadFixVersions = useCallback(async (projectKey) => {
    try {
      const versions = await deploymentsApi.getFixVersions(projectKey);
      setFixVersions(prev => ({ ...prev, [projectKey]: versions }));
    } catch (err) {
      console.error('Error loading fix versions:', err);
    }
  }, []);

  const addContact = useCallback(async (contactData) => {
    const created = await createContact(appId, contactData);
    setContacts(prev => [...prev, created]);
    return created;
  }, [appId, createContact]);

  const removeContact = useCallback(async (contactId) => {
    await deleteContact(contactId);
    setContacts(prev => prev.filter(c => c.id !== contactId));
  }, [deleteContact]);

  const addDoc = useCallback(async (docData) => {
    const created = await createDoc(appId, docData);
    setDocs(prev => [...prev, created]);
    return created;
  }, [appId, createDoc]);

  const removeDoc = useCallback(async (docId) => {
    await deleteDoc(docId);
    setDocs(prev => prev.filter(d => d.id !== docId));
  }, [deleteDoc]);

  return {
    repos,
    backlogs,
    contacts,
    docs,
    riskStories,
    businessOutcomes,
    controlSmes,
    deploymentEnvironments,
    fixVersions,
    loading,
    loadFixVersions,
    addContact,
    removeContact,
    addDoc,
    removeDoc,
  };
}

export default useAppProfileData;
