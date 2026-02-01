import { useCallback, useState } from 'react';
import { DOC_TYPES } from '../components/products/addAppWizard/constants';
import useAddAppWizardData from './useAddAppWizardData';
import useAutoClearError from './useAutoClearError';
import useDocsSelection from './useDocsSelection';
import useJiraSelection from './useJiraSelection';
import useRepoSelection from './useRepoSelection';
import useWizardSubmission from './useWizardSubmission';

function useAddAppWizardState({ onComplete, onClose }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const {
    serviceInstances,
    availableRepos,
    availableJira,
    error,
    setError,
  } = useAddAppWizardData(selectedApp);

  useAutoClearError(error, setError);
  const repoSelection = useRepoSelection(availableRepos);
  const jiraSelection = useJiraSelection(availableJira);
  const docsSelection = useDocsSelection();

  const selectApp = useCallback((app) => setSelectedApp(app), []);
  const selectProduct = useCallback((product) => setSelectedProduct(product), []);

  const {
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
  } = repoSelection;

  const {
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
  } = jiraSelection;

  const { addedDocs, addDoc, removeDoc, setAddedDocs } = docsSelection;
  const {
    submitError,
    submitSuccess,
    submitWarnings,
    finish,
    resetSubmission,
  } = useWizardSubmission({
    onComplete,
    selectedApp,
    selectedProduct,
    getAllSelectedRepos,
    getAllSelectedJira,
    addedDocs,
  });

  const canProceed = useCallback((stepName) => {
    if (stepName === 'product') return selectedProduct !== null;
    if (stepName === 'instances') return serviceInstances.length > 0;
    if (stepName === 'repos') return totalSelectedRepos > 0;
    if (stepName === 'jira') return totalSelectedJira > 0;
    if (stepName === 'docs') return addedDocs.length === DOC_TYPES.length;
    return true;
  }, [selectedProduct, serviceInstances, totalSelectedRepos, totalSelectedJira, addedDocs]);

  const reset = useCallback(() => {
    setSelectedApp(null);
    setSelectedProduct(null);
    setSelectedRepos([]);
    setManualRepos([]);
    setSelectedJira([]);
    setManualJira([]);
    setAddedDocs([]);
    setError(null);
    resetSubmission();
  }, [
    setError,
    setSelectedRepos,
    setManualRepos,
    setSelectedJira,
    setManualJira,
    setAddedDocs,
    resetSubmission,
  ]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return {
    selectedApp,
    selectedProduct,
    serviceInstances,
    availableRepos,
    selectedRepos,
    manualRepos,
    availableJira,
    selectedJira,
    manualJira,
    addedDocs,
    error,
    submitError,
    submitSuccess,
    submitWarnings,
    totalSelectedRepos,
    totalSelectedJira,
    getAllSelectedRepos,
    getAllSelectedJira,
    setError,
    selectApp,
    selectProduct,
    toggleRepo,
    selectAllRepos,
    addManualRepo,
    removeManualRepo,
    toggleJira,
    selectAllJira,
    addManualJira,
    removeManualJira,
    addDoc,
    removeDoc,
    canProceed,
    finish,
    handleClose,
    reset,
  };
}

export default useAddAppWizardState;
