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
  ReviewStep,
  ResultStep
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
    selectedApp,
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

  const isAddingToProduct = selectedApp?.isOnboarded;
  const isResultStep = currentStep === 'result';

  // When adding to product, only show search, product, review steps
  // Don't show result step in indicator - it's a final confirmation
  const visibleSteps = isAddingToProduct
    ? ['search', 'product', 'review']
    : STEPS.filter(s => s !== 'result');
  const visibleLabels = isAddingToProduct
    ? { search: 'Search', product: 'Product', review: 'Confirm' }
    : STEP_LABELS;

  const currentIndex = visibleSteps.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentStep === 'review';

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <ModalTitle step={currentStep} productName={selectedProduct?.name} isAddingToProduct={isAddingToProduct} />
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ minHeight: '450px' }}>
        {!isResultStep && (
          <StepIndicator
            currentStep={currentStep}
            steps={visibleSteps}
            labels={visibleLabels}
            onStepClick={goToStep}
          />
        )}

        {error && !isResultStep && (
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
          isAddingToProduct={isAddingToProduct}
          onClose={handleClose}
          onBack={goBack}
          onNext={goNext}
          onFinish={finish}
        />
      </Modal.Footer>
    </Modal>
  );
}

function ModalTitle({ step, productName, isAddingToProduct }) {
  if (step === 'search') return 'Search Application';
  if (step === 'product') return 'Select Product';
  if (step === 'result') return 'Result';
  if (isAddingToProduct) return `Add to ${productName || 'Product'}`;
  return `Onboard to ${productName || 'Product'}`;
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
    case 'result':
      return <ResultStep />;
    default:
      return null;
  }
}

function FooterButtons({ isFirstStep, isLastStep, currentStep, canProceed, isAddingToProduct, onClose, onBack, onNext, onFinish }) {
  // Result step only shows Close button
  if (currentStep === 'result') {
    return (
      <Button variant="primary" onClick={onClose}>
        Close
      </Button>
    );
  }

  const isReviewStep = currentStep === 'review';
  const showNextButton = !isReviewStep && currentStep !== 'search' && currentStep !== 'product';

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
      {isReviewStep && (
        <Button variant="success" onClick={onFinish}>
          {isAddingToProduct ? 'Add to Product' : 'Add Application'}
        </Button>
      )}
    </>
  );
}

export default AddAppModal;
