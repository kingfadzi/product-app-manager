import { useState, useEffect, useCallback } from 'react';
import useApps from '../../../hooks/useApps';
import { riskStoriesApi, outcomesApi, guildSmesApi, deploymentsApi, syncApi } from '../../../services/api';

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
  const [guildSmes, setGuildSmes] = useState([]);
  const [deploymentEnvironments, setDeploymentEnvironments] = useState([]);
  const [fixVersions, setFixVersions] = useState({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const loadData = useCallback(async () => {
    if (!appId) return;
    setLoading(true);
    try {
      const [reposData, backlogsData, contactsData, docsData, riskData, outcomesData, smesData, envsData] = await Promise.all([
        getAppRepos(appId),
        getAppBacklogs(appId),
        getAppContacts(appId),
        getAppDocs(appId),
        riskStoriesApi.getByApp(appId).catch(() => []),
        outcomesApi.getByApp(appId).catch(() => []),
        guildSmesApi.getByApp(appId).catch(() => []),
        deploymentsApi.getEnvironments().catch(() => []),
      ]);
      setRepos(reposData || []);
      setBacklogs(backlogsData || []);
      setContacts(contactsData || []);
      setDocs(docsData || []);
      setRiskStories(riskData || []);
      setBusinessOutcomes(outcomesData || []);
      setGuildSmes(smesData || []);
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
    const result = await createContact(appId, contactData);
    // Backend returns { success, stakeholder_id, message }
    // Construct contact object for local state
    const newContact = {
      id: result.stakeholder_id,
      name: contactData.name,
      email: contactData.email,
      role: contactData.role,
    };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, [appId, createContact]);

  const removeContact = useCallback(async (contactId) => {
    await deleteContact(appId, contactId);
    setContacts(prev => prev.filter(c => c.id !== contactId));
  }, [appId, deleteContact]);

  const addDoc = useCallback(async (docData) => {
    const created = await createDoc(appId, docData);
    setDocs(prev => [...prev, created]);
    return created;
  }, [appId, createDoc]);

  const removeDoc = useCallback(async (docId) => {
    await deleteDoc(docId);
    setDocs(prev => prev.filter(d => d.id !== docId));
  }, [deleteDoc]);

  const addGuildSme = useCallback(async (smeData) => {
    const result = await guildSmesApi.create(appId, smeData);
    // Backend returns { success, stakeholder_id, message }
    const newSme = {
      id: result.stakeholder_id,
      name: smeData.name,
      email: smeData.email,
      role: smeData.role,
    };
    setGuildSmes(prev => [...prev, newSme]);
    return newSme;
  }, [appId]);

  const removeGuildSme = useCallback(async (smeId) => {
    await guildSmesApi.delete(appId, smeId);
    setGuildSmes(prev => prev.filter(s => s.id !== smeId));
  }, [appId]);

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
      console.error('Error syncing governance data:', err);
      setSyncError(err.message || 'Failed to sync governance data');
    } finally {
      setSyncing(false);
    }
  }, [appId]);

  return {
    repos,
    backlogs,
    contacts,
    docs,
    riskStories,
    businessOutcomes,
    guildSmes,
    deploymentEnvironments,
    fixVersions,
    loading,
    syncing,
    syncError,
    loadFixVersions,
    addContact,
    removeContact,
    addDoc,
    removeDoc,
    addGuildSme,
    removeGuildSme,
    syncGovernance,
  };
}

export default useAppProfileData;
