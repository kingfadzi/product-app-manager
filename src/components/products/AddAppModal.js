import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import StepIndicator from '../common/StepIndicator';
import {
  AddAppWizardProvider,
  useAddAppWizard,
  STEPS,
  STEP_LABELS,
  SearchStep,
  ProductStep,
  DetailsStep,
  InstancesStep,
  ReposStep,
  JiraStep,
  DocsStep,
  ReviewStep
} from './addAppWizard';

function AddAppModal({ show, onHide, onAdd, existingAppIds = [] }) {
  return (
    <AddAppWizardProvider onComplete={onAdd} onClose={onHide}>
      <AddAppModalContent show={show} />
    </AddAppWizardProvider>
  );
}

function AddAppModalContent({ show }) {
  const {
    currentStep,
    selectedProduct,
    error,
    setError,
    goToStep,
    goBack,
    goNext,
    canProceed,
    finish,
    handleClose
  } = useAddAppWizard();

  const currentIndex = STEPS.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEPS.length - 1;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <ModalTitle step={currentStep} productName={selectedProduct?.name} />
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ minHeight: '450px' }}>
        <StepIndicator
          currentStep={currentStep}
          steps={STEPS}
          labels={STEP_LABELS}
          onStepClick={goToStep}
        />

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
            {error}
          </Alert>
        )}

        <StepContent step={currentStep} />
      </Modal.Body>

      <Modal.Footer>
        <FooterButtons
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          currentStep={currentStep}
          canProceed={canProceed()}
          onClose={handleClose}
          onBack={goBack}
          onNext={goNext}
          onFinish={finish}
        />
      </Modal.Footer>
    </Modal>
  );
}

function ModalTitle({ step, productName }) {
  if (step === 'search') return 'Search Application';
  if (step === 'product') return 'Select Product';
  return `Add to ${productName || 'Product'}`;
}

function StepContent({ step }) {
  switch (step) {
    case 'search':
      return <SearchStep />;
    case 'product':
      return <ProductStep />;
    case 'details':
      return <DetailsStep />;
    case 'instances':
      return <InstancesStep />;
    case 'repos':
      return <ReposStep />;
    case 'jira':
      return <JiraStep />;
    case 'docs':
      return <DocsStep />;
    case 'review':
      return <ReviewStep />;
    default:
      return null;
  }
}

function FooterButtons({ isFirstStep, isLastStep, currentStep, canProceed, onClose, onBack, onNext, onFinish }) {
  const showNextButton = !isLastStep && currentStep !== 'search' && currentStep !== 'product';

  return (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      {!isFirstStep && (
        <Button variant="outline-secondary" onClick={onBack}>
          Back
        </Button>
      )}
      {showNextButton && (
        <Button variant="primary" onClick={onNext} disabled={!canProceed}>
          Next
        </Button>
      )}
      {isLastStep && (
        <Button variant="success" onClick={onFinish}>
          Add Application
        </Button>
      )}
    </>
  );
}

export default AddAppModal;
