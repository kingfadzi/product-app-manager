import { useMemo, useState } from 'react';
import useApps from '../../../hooks/useApps';
import {
  useAppProfileLoader,
  useAppProfileContacts,
  useAppProfileDocs,
  useAppProfileGuildSmes,
  useAppProfileFixVersions,
  useAppProfileGovernanceSync,
} from '../../../hooks/useAppProfile';

function useAppProfileData(appId) {
  const {
    getAppRepos, getAppBacklogs, getAppContacts, getAppDocs,
    createContact, deleteContact, createDoc, deleteDoc
  } = useApps();

  const [error, setError] = useState(null);
  const fetchers = useMemo(() => ({
    getAppRepos,
    getAppBacklogs,
    getAppContacts,
    getAppDocs,
  }), [getAppRepos, getAppBacklogs, getAppContacts, getAppDocs]);

  const {
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
  } = useAppProfileLoader(appId, fetchers, setError);

  const { addContact, removeContact } = useAppProfileContacts({
    appId,
    createContact,
    deleteContact,
    setContacts,
    setError,
  });

  const { addDoc, removeDoc } = useAppProfileDocs({
    appId,
    createDoc,
    deleteDoc,
    setDocs,
    setError,
  });

  const { addGuildSme, removeGuildSme } = useAppProfileGuildSmes({
    appId,
    setGuildSmes,
    setError,
  });

  const { fixVersions, loadFixVersions } = useAppProfileFixVersions({ setError });

  const { syncGovernance, syncing, syncError } = useAppProfileGovernanceSync({
    appId,
    setRiskStories,
    setBusinessOutcomes,
    setError,
  });

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
    error,
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
