import { useCallback, useEffect, useState } from 'react';

const INITIAL_DATA = {
  selectedBacklog: null,
  selectedVersion: null,
  navigatorId: '',
  environments: [],
  attestations: {
    codeReviewed: false,
    testsPass: false,
    securityScan: false,
    documentationUpdated: false,
    rollbackPlan: false
  }
};

const allTrue = (values) => values.every((value) => value === true);

function useDeploymentWizardState({ show, onHide, backlogs, fixVersions, loadFixVersions }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);

  useEffect(() => {
    if (show) {
      setStep(1);
      setData(INITIAL_DATA);
    }
  }, [show]);

  const handleClose = useCallback(() => {
    setStep(1);
    setData(INITIAL_DATA);
    onHide();
  }, [onHide]);

  const handleBacklogChange = useCallback((projectKey) => {
    const backlog = backlogs.find(b => b.projectKey === projectKey);
    setData(prev => ({ ...prev, selectedBacklog: backlog, selectedVersion: null }));
    if (backlog && loadFixVersions) {
      loadFixVersions(projectKey);
    }
  }, [backlogs, loadFixVersions]);

  const handleVersionChange = useCallback((versionId) => {
    const versions = fixVersions[data.selectedBacklog?.projectKey] || [];
    const version = versions.find(v => v.id === versionId);
    setData(prev => ({ ...prev, selectedVersion: version }));
  }, [data.selectedBacklog, fixVersions]);

  const toggleEnvironment = useCallback((envId) => {
    setData(prev => ({
      ...prev,
      environments: prev.environments.includes(envId)
        ? prev.environments.filter(id => id !== envId)
        : [...prev.environments, envId]
    }));
  }, []);

  const toggleAttestation = useCallback((key) => {
    setData(prev => ({
      ...prev,
      attestations: { ...prev.attestations, [key]: !prev.attestations[key] }
    }));
  }, []);

  const canProceed = useCallback(() => {
    if (step === 1) return !!data.selectedBacklog;
    if (step === 2) return !!data.selectedVersion;
    if (step === 3) return !!data.navigatorId;
    if (step === 4) return data.environments.length > 0;
    return true;
  }, [data, step]);

  const allAttestationsChecked = useCallback(
    () => allTrue(Object.values(data.attestations)),
    [data.attestations]
  );

  const getAvailableVersions = useCallback(
    () => fixVersions[data.selectedBacklog?.projectKey] || [],
    [data.selectedBacklog, fixVersions]
  );

  return {
    step,
    setStep,
    data,
    setData,
    handleClose,
    handleBacklogChange,
    handleVersionChange,
    toggleEnvironment,
    toggleAttestation,
    canProceed,
    allAttestationsChecked,
    getAvailableVersions,
  };
}

export default useDeploymentWizardState;
