import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import StepIndicator from '../../common/StepIndicator';
import useDeploymentWizardState from '../../../hooks/useDeploymentWizardState';
import { StepProject, StepVersion, StepDetails, StepEnvironments, StepAttestation } from './deploymentWizardSteps';

const WIZARD_STEPS = ['Project', 'Version', 'Details', 'Environments', 'Attestation'];

function DeploymentWizardModal({ show, onHide, backlogs, businessOutcomes, deploymentEnvironments, fixVersions, loadFixVersions }) {
  const {
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
  } = useDeploymentWizardState({
    show,
    onHide,
    backlogs,
    fixVersions,
    loadFixVersions,
  });

  const handleCreate = () => {
    alert('Release created successfully!');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" keyboard={false}>
      <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>Create New Release</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: 0 }}>
        <StepIndicator steps={WIZARD_STEPS} currentStep={step} />
        {step === 1 && <StepProject backlogs={backlogs} data={data} onChange={handleBacklogChange} />}
        {step === 2 && <StepVersion versions={getAvailableVersions()} data={data} onChange={handleVersionChange} />}
        {step === 3 && <StepDetails data={data} setData={setData} businessOutcomes={businessOutcomes} />}
        {step === 4 && <StepEnvironments data={data} environments={deploymentEnvironments} toggleEnvironment={toggleEnvironment} />}
        {step === 5 && <StepAttestation data={data} environments={deploymentEnvironments} toggleAttestation={toggleAttestation} />}
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        {step > 1 ? (
          <Button variant="outline-secondary" onClick={() => setStep(s => s - 1)} style={{ fontSize: '0.875rem' }}>
            ← Back
          </Button>
        ) : <div />}
        <div>
          <Button variant="secondary" onClick={handleClose} className="mr-2" style={{ fontSize: '0.875rem' }}>Cancel</Button>
          {step < 5 ? (
            <Button variant="dark" onClick={() => setStep(s => s + 1)} style={{ fontSize: '0.875rem' }} disabled={!canProceed()}>
              Next →
            </Button>
          ) : (
            <Button variant="success" onClick={handleCreate} style={{ fontSize: '0.875rem' }} disabled={!allAttestationsChecked()}>
              Create Release
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default DeploymentWizardModal;
