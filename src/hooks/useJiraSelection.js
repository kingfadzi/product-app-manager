import { useCallback, useState } from 'react';
import { addUniqueBy, getSelectedFromAvailable, removeById, toggleId } from '../utils/selection';

const getJiraKey = (project) => project.projectKey;

function useJiraSelection(availableJira) {
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
    setSelectedJira((prev) =>
      prev.includes(project.projectKey) ? prev : [...prev, project.projectKey]
    );
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
    selectedJira,
    manualJira,
    totalSelectedJira,
    toggleJira,
    selectAllJira,
    addManualJira,
    removeManualJira,
    getAllSelectedJira,
    setSelectedJira,
    setManualJira,
  };
}

export default useJiraSelection;
