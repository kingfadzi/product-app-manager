import { useCallback, useEffect, useState } from 'react';
import { riskStoriesApi, outcomesApi, guildSmesApi, deploymentsApi, syncApi } from '../services/api';

const settledValue = (result) => (result.status === 'fulfilled' ? result.value : []);

const resolveResults = (results) => {
  const [reposData, backlogsData, contactsData, docsData, riskData, outcomesData, smesData, envsData] = results.map(settledValue);
  return {
    reposData, backlogsData, contactsData, docsData, riskData, outcomesData, smesData, envsData,
    hasError: results.some((result) => result.status === 'rejected'),
  };
};

export function useAppProfileLoader(appId, fetchers, setError) {
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
      if (resolved.hasError) setError('Some app profile data failed to load.');
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

  useEffect(() => { load(); }, [load]);

  return {
    repos, backlogs, contacts, docs, riskStories, businessOutcomes, guildSmes, deploymentEnvironments,
    loading, setContacts, setDocs, setGuildSmes, setRiskStories, setBusinessOutcomes,
  };
}

export function useAppProfileContacts({ appId, createContact, deleteContact, setContacts, setError }) {
  const addContact = useCallback(async (contactData) => {
    try {
      const result = await createContact(appId, contactData);
      const newContact = { id: result.stakeholder_id, name: contactData.name, email: contactData.email, role: contactData.role };
      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (err) {
      setError(err.message || 'Failed to add contact.');
      throw err;
    }
  }, [appId, createContact, setContacts, setError]);

  const removeContact = useCallback(async (contactId) => {
    try {
      await deleteContact(appId, contactId);
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (err) {
      setError(err.message || 'Failed to remove contact.');
      throw err;
    }
  }, [appId, deleteContact, setContacts, setError]);

  return { addContact, removeContact };
}

export function useAppProfileDocs({ appId, createDoc, deleteDoc, setDocs, setError }) {
  const addDoc = useCallback(async (docData) => {
    try {
      const created = await createDoc(appId, docData);
      setDocs(prev => [...prev, created]);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to add documentation.');
      throw err;
    }
  }, [appId, createDoc, setDocs, setError]);

  const removeDoc = useCallback(async (docId) => {
    try {
      await deleteDoc(docId);
      setDocs(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      setError(err.message || 'Failed to remove documentation.');
      throw err;
    }
  }, [deleteDoc, setDocs, setError]);

  return { addDoc, removeDoc };
}

export function useAppProfileGuildSmes({ appId, setGuildSmes, setError }) {
  const addGuildSme = useCallback(async (smeData) => {
    try {
      const result = await guildSmesApi.create(appId, smeData);
      const newSme = { id: result.stakeholder_id, name: smeData.name, email: smeData.email, role: smeData.role };
      setGuildSmes(prev => [...prev, newSme]);
      return newSme;
    } catch (err) {
      setError(err.message || 'Failed to add guild SME.');
      throw err;
    }
  }, [appId, setGuildSmes, setError]);

  const removeGuildSme = useCallback(async (smeId) => {
    try {
      await guildSmesApi.delete(appId, smeId);
      setGuildSmes(prev => prev.filter(s => s.id !== smeId));
    } catch (err) {
      setError(err.message || 'Failed to remove guild SME.');
      throw err;
    }
  }, [appId, setGuildSmes, setError]);

  return { addGuildSme, removeGuildSme };
}

export function useAppProfileFixVersions({ setError }) {
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

export function useAppProfileGovernanceSync({ appId, setRiskStories, setBusinessOutcomes, setError }) {
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
