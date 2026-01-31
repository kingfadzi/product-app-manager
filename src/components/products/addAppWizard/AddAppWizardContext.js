import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STEPS, DOC_TYPES } from './constants';
import { appsApi, reposApi, backlogsApi } from '../../../services/api';

const AddAppWizardContext = createContext(null);

export function AddAppWizardProvider({ children, onComplete, onClose }) {
  // Navigation
  const [currentStep, setCurrentStep] = useState('search');

  // Step 1: Search - selected app from CMDB
  const [selectedApp, setSelectedApp] = useState(null);

  // Step 2: Product Selection
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Step 3: Service Instances (loaded when app selected)
  const [serviceInstances, setServiceInstances] = useState([]);

  // Step 5: Repos
  const [availableRepos, setAvailableRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [manualRepos, setManualRepos] = useState([]);

  // Step 6: Jira
  const [availableJira, setAvailableJira] = useState([]);
  const [selectedJira, setSelectedJira] = useState([]);
  const [manualJira, setManualJira] = useState([]);

  // Step 7: Documentation
  const [addedDocs, setAddedDocs] = useState([]);

  // Error handling
  const [error, setError] = useState(null);

  // Submit result
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Load app data when selected
  useEffect(() => {
    if (!selectedApp) return;

    const appId = selectedApp.cmdbId || selectedApp.correlation_id || selectedApp.id;

    Promise.all([
      appsApi.getServiceInstances(appId).catch(() => []),
      reposApi.getAvailable(appId).catch(() => []),
      reposApi.getAvailableBitbucket(appId).catch(() => []),
      backlogsApi.getAvailable(appId).catch(() => []),
    ])
      .then(([instances, gitlabRepos, bitbucketRepos, jira]) => {
        setServiceInstances(instances || []);
        // Combine GitLab and Bitbucket repos
        setAvailableRepos([...(gitlabRepos || []), ...(bitbucketRepos || [])]);
        setAvailableJira(jira || []);
      })
      .catch(() => {
        setServiceInstances([]);
        setAvailableRepos([]);
        setAvailableJira([]);
        setError('Failed to load app data. Please try again.');
      });
  }, [selectedApp]);

  // Navigation helpers
  const goToStep = useCallback((step) => setCurrentStep(step), []);

  const goBack = useCallback(() => {
    // If app is already onboarded and we're on review, go back to product
    if (selectedApp?.isOnboarded && currentStep === 'review') {
      setCurrentStep('product');
      return;
    }
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  }, [currentStep, selectedApp]);

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1]);
  }, [currentStep]);

  // Selection helpers
  const selectApp = useCallback((app) => {
    setSelectedApp(app);
    setCurrentStep('product');
  }, []);

  const selectProduct = useCallback((product) => {
    setSelectedProduct(product);
    // If app is already onboarded, skip to review (just adding to another product)
    if (selectedApp?.isOnboarded) {
      setCurrentStep('review');
    } else {
      setCurrentStep('details');
    }
  }, [selectedApp]);

  // Repo helpers
  const toggleRepo = useCallback((repoId) => {
    setSelectedRepos(prev =>
      prev.includes(repoId)
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  }, []);

  const selectAllRepos = useCallback((checked) => {
    setSelectedRepos(checked ? availableRepos.map(r => r.repoId) : []);
  }, [availableRepos]);

  const addManualRepo = useCallback((repo) => {
    const inAvailable = availableRepos.some(r => r.repoId === repo.repoId);
    const inManual = manualRepos.some(r => r.repoId === repo.repoId);

    if (!inAvailable && !inManual) {
      setManualRepos(prev => [...prev, repo]);
    } else if (inAvailable && !selectedRepos.includes(repo.repoId)) {
      setSelectedRepos(prev => [...prev, repo.repoId]);
    }
  }, [availableRepos, manualRepos, selectedRepos]);

  const removeManualRepo = useCallback((repoId) => {
    setManualRepos(prev => prev.filter(r => r.repoId !== repoId));
  }, []);

  // Jira helpers
  const toggleJira = useCallback((projectKey) => {
    setSelectedJira(prev =>
      prev.includes(projectKey)
        ? prev.filter(k => k !== projectKey)
        : [...prev, projectKey]
    );
  }, []);

  const selectAllJira = useCallback((checked) => {
    setSelectedJira(checked ? availableJira.map(j => j.projectKey) : []);
  }, [availableJira]);

  const addManualJira = useCallback((project) => {
    const inAvailable = availableJira.some(j => j.projectKey === project.projectKey);
    const inManual = manualJira.some(j => j.projectKey === project.projectKey);

    if (!inAvailable && !inManual) {
      setManualJira(prev => [...prev, project]);
    } else if (inAvailable && !selectedJira.includes(project.projectKey)) {
      setSelectedJira(prev => [...prev, project.projectKey]);
    }
  }, [availableJira, manualJira, selectedJira]);

  const removeManualJira = useCallback((projectKey) => {
    setManualJira(prev => prev.filter(j => j.projectKey !== projectKey));
  }, []);

  // Documentation helpers
  const addDoc = useCallback((type, url) => {
    if (type && url) {
      setAddedDocs(prev => [...prev, { type, url }]);
    }
  }, []);

  const removeDoc = useCallback((type) => {
    setAddedDocs(prev => prev.filter(d => d.type !== type));
  }, []);

  // Computed values
  const getAllSelectedRepos = useCallback(() => {
    const fromAvailable = selectedRepos
      .map(repoId => availableRepos.find(r => r.repoId === repoId))
      .filter(Boolean);
    return [...fromAvailable, ...manualRepos];
  }, [selectedRepos, availableRepos, manualRepos]);

  const getAllSelectedJira = useCallback(() => {
    const fromAvailable = selectedJira
      .map(key => availableJira.find(j => j.projectKey === key))
      .filter(Boolean);
    return [...fromAvailable, ...manualJira];
  }, [selectedJira, availableJira, manualJira]);

  const totalSelectedRepos = selectedRepos.length + manualRepos.length;
  const totalSelectedJira = selectedJira.length + manualJira.length;

  // Validation
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'product':
        return selectedProduct !== null;
      case 'instances':
        return serviceInstances.length > 0;
      case 'repos':
        return totalSelectedRepos > 0;
      case 'jira':
        return totalSelectedJira > 0;
      case 'docs':
        return addedDocs.length === DOC_TYPES.length;
      default:
        return true;
    }
  }, [currentStep, selectedProduct, serviceInstances, totalSelectedRepos, totalSelectedJira, addedDocs]);

  // Finish
  const finish = useCallback(async () => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      await onComplete([selectedApp], {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        repos: getAllSelectedRepos(),
        jiraProjects: getAllSelectedJira(),
        documentation: addedDocs
      });
      // Success - go to result step
      setSubmitSuccess(true);
      setCurrentStep('result');
    } catch (err) {
      // Error - go to result step with error
      setSubmitError(err.message || 'Failed to add application. Please try again.');
      setCurrentStep('result');
    }
  }, [selectedApp, selectedProduct, getAllSelectedRepos, getAllSelectedJira, addedDocs, onComplete]);

  // Reset
  const reset = useCallback(() => {
    setCurrentStep('search');
    setSelectedApp(null);
    setSelectedProduct(null);
    setServiceInstances([]);
    setAvailableRepos([]);
    setSelectedRepos([]);
    setManualRepos([]);
    setAvailableJira([]);
    setSelectedJira([]);
    setManualJira([]);
    setAddedDocs([]);
    setError(null);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[AddAppWizard] handleClose -> reset + onClose');
    }
    reset();
    onClose();
  }, [reset, onClose]);

  const value = {
    // State
    currentStep,
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

    // Computed
    totalSelectedRepos,
    totalSelectedJira,
    getAllSelectedRepos,
    getAllSelectedJira,

    // Actions
    setError,
    goToStep,
    goBack,
    goNext,
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
  };

  return (
    <AddAppWizardContext.Provider value={value}>
      {children}
    </AddAppWizardContext.Provider>
  );
}

export function useAddAppWizard() {
  const context = useContext(AddAppWizardContext);
  if (!context) {
    throw new Error('useAddAppWizard must be used within AddAppWizardProvider');
  }
  return context;
}
