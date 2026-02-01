import { useCallback, useState } from 'react';
import { addUniqueBy, getSelectedFromAvailable, removeById, toggleId } from '../utils/selection';

const getRepoId = (repo) => repo.repoId;
const getJiraKey = (project) => project.projectKey;

export function useRepoSelection(availableRepos) {
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [manualRepos, setManualRepos] = useState([]);

  const toggleRepo = useCallback((repoId) => {
    setSelectedRepos((prev) => toggleId(prev, repoId));
  }, []);

  const selectAllRepos = useCallback((checked) => {
    setSelectedRepos(checked ? availableRepos.map(getRepoId) : []);
  }, [availableRepos]);

  const addManualRepo = useCallback((repo) => {
    setManualRepos((prev) => addUniqueBy(prev, repo, getRepoId));
    setSelectedRepos((prev) => prev.includes(repo.repoId) ? prev : [...prev, repo.repoId]);
  }, []);

  const removeManualRepo = useCallback((repoId) => {
    setManualRepos((prev) => removeById(prev, repoId, getRepoId));
  }, []);

  const getAllSelectedRepos = useCallback(() => {
    const fromAvailable = getSelectedFromAvailable(selectedRepos, availableRepos, getRepoId);
    return [...fromAvailable, ...manualRepos];
  }, [selectedRepos, availableRepos, manualRepos]);

  const totalSelectedRepos = selectedRepos.length + manualRepos.length;

  return {
    selectedRepos, manualRepos, totalSelectedRepos,
    toggleRepo, selectAllRepos, addManualRepo, removeManualRepo, getAllSelectedRepos,
    setSelectedRepos, setManualRepos,
  };
}

export function useJiraSelection(availableJira) {
  const [selectedJira, setSelectedJira] = useState([]);
  const [manualJira, setManualJira] = useState([]);

  const toggleJira = useCallback((projectKey) => {
    setSelectedJira((prev) => toggleId(prev, projectKey));
  }, []);

  const selectAllJira = useCallback((checked) => {
    setSelectedJira(checked ? availableJira.map(getJiraKey) : []);
  }, [availableJira]);

  const addManualJira = useCallback((project) => {
    setManualJira((prev) => addUniqueBy(prev, project, getJiraKey));
    setSelectedJira((prev) => prev.includes(project.projectKey) ? prev : [...prev, project.projectKey]);
  }, []);

  const removeManualJira = useCallback((projectKey) => {
    setManualJira((prev) => removeById(prev, projectKey, getJiraKey));
  }, []);

  const getAllSelectedJira = useCallback(() => {
    const fromAvailable = getSelectedFromAvailable(selectedJira, availableJira, getJiraKey);
    return [...fromAvailable, ...manualJira];
  }, [selectedJira, availableJira, manualJira]);

  const totalSelectedJira = selectedJira.length + manualJira.length;

  return {
    selectedJira, manualJira, totalSelectedJira,
    toggleJira, selectAllJira, addManualJira, removeManualJira, getAllSelectedJira,
    setSelectedJira, setManualJira,
  };
}

export function useDocsSelection() {
  const [addedDocs, setAddedDocs] = useState([]);

  const addDoc = useCallback((type, url) => {
    if (!type || !url) return;
    setAddedDocs((prev) => [...prev, { type, url }]);
  }, []);

  const removeDoc = useCallback((type) => {
    setAddedDocs((prev) => prev.filter((doc) => doc.type !== type));
  }, []);

  return { addedDocs, addDoc, removeDoc, setAddedDocs };
}
