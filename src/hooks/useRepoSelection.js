import { useCallback, useState } from 'react';
import { addUniqueBy, getSelectedFromAvailable, removeById, toggleId } from '../utils/selection';

const getRepoId = (repo) => repo.repoId;

function useRepoSelection(availableRepos) {
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
    setSelectedRepos((prev) =>
      prev.includes(repo.repoId) ? prev : [...prev, repo.repoId]
    );
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
    selectedRepos,
    manualRepos,
    totalSelectedRepos,
    toggleRepo,
    selectAllRepos,
    addManualRepo,
    removeManualRepo,
    getAllSelectedRepos,
    setSelectedRepos,
    setManualRepos,
  };
}

export default useRepoSelection;
