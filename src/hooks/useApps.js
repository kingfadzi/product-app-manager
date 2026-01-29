import { useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { appsApi, reposApi, backlogsApi, contactsApi, docsApi } from '../services/api';
import useApi from './useApi';

export function useApps() {
  const { apps, setApps } = useContext(AppContext);
  const { loading, error, execute, clearError } = useApi();

  const createApp = useCallback(async (app) => {
    const created = await execute(() => appsApi.create(app));
    setApps(prev => [...prev, created]);
    return created;
  }, [execute, setApps]);

  const updateApp = useCallback(async (id, app) => {
    const updated = await execute(() => appsApi.update(id, app));
    setApps(prev => prev.map(a => a.id === id ? updated : a));
    return updated;
  }, [execute, setApps]);

  const searchApps = useCallback(async (query) => {
    return execute(() => appsApi.search(query));
  }, [execute]);

  const getAppById = useCallback((id) => {
    return apps.find(a => a.id === id);
  }, [apps]);

  // Repos
  const getAppRepos = useCallback(async (appId) => {
    return execute(() => reposApi.getByApp(appId));
  }, [execute]);

  const createRepo = useCallback(async (appId, repo) => {
    return execute(() => reposApi.create(appId, repo));
  }, [execute]);

  const updateRepo = useCallback(async (id, repo) => {
    return execute(() => reposApi.update(id, repo));
  }, [execute]);

  const deleteRepo = useCallback(async (id) => {
    return execute(() => reposApi.delete(id));
  }, [execute]);

  // Backlogs
  const getAppBacklogs = useCallback(async (appId) => {
    return execute(() => backlogsApi.getByApp(appId));
  }, [execute]);

  const createBacklog = useCallback(async (appId, backlog) => {
    return execute(() => backlogsApi.create(appId, backlog));
  }, [execute]);

  const updateBacklog = useCallback(async (id, backlog) => {
    return execute(() => backlogsApi.update(id, backlog));
  }, [execute]);

  const deleteBacklog = useCallback(async (id) => {
    return execute(() => backlogsApi.delete(id));
  }, [execute]);

  // Contacts
  const getAppContacts = useCallback(async (appId) => {
    return execute(() => contactsApi.getByApp(appId));
  }, [execute]);

  const createContact = useCallback(async (appId, contact) => {
    return execute(() => contactsApi.create(appId, contact));
  }, [execute]);

  const updateContact = useCallback(async (id, contact) => {
    return execute(() => contactsApi.update(id, contact));
  }, [execute]);

  const deleteContact = useCallback(async (id) => {
    return execute(() => contactsApi.delete(id));
  }, [execute]);

  // Docs
  const getAppDocs = useCallback(async (appId) => {
    return execute(() => docsApi.getByApp(appId));
  }, [execute]);

  const createDoc = useCallback(async (appId, doc) => {
    return execute(() => docsApi.create(appId, doc));
  }, [execute]);

  const updateDoc = useCallback(async (id, doc) => {
    return execute(() => docsApi.update(id, doc));
  }, [execute]);

  const deleteDoc = useCallback(async (id) => {
    return execute(() => docsApi.delete(id));
  }, [execute]);

  return {
    apps,
    loading,
    error,
    clearError,
    createApp,
    updateApp,
    searchApps,
    getAppById,
    // Repos
    getAppRepos,
    createRepo,
    updateRepo,
    deleteRepo,
    // Backlogs
    getAppBacklogs,
    createBacklog,
    updateBacklog,
    deleteBacklog,
    // Contacts
    getAppContacts,
    createContact,
    updateContact,
    deleteContact,
    // Docs
    getAppDocs,
    createDoc,
    updateDoc,
    deleteDoc,
  };
}

export default useApps;
