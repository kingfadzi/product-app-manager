import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STEPS, DOC_TYPES } from './constants';

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

    Promise.all([
      fetch(`/api/apps/${selectedApp.cmdbId}/service-instances`).then(res => res.json()),
      fetch(`/api/apps/${selectedApp.cmdbId}/available-repos`).then(res => res.json()),
      fetch(`/api/apps/${selectedApp.cmdbId}/available-jira`).then(res => res.json()),
    ])
      .then(([instances, repos, jira]) => {
        setServiceInstances(instances);
        setAvailableRepos(repos);
        setAvailableJira(jira);
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
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1]);
  }, [currentStep]);

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
    setCurrentStep('details');
  }, []);

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
  const finish = useCallback(() => {
    onComplete([selectedApp], {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      repos: getAllSelectedRepos(),
      jiraProjects: getAllSelectedJira(),
      documentation: addedDocs
    });
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
  }, []);

  const handleClose = useCallback(() => {
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
