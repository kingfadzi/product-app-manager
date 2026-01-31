import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import StepWizard from 'react-step-wizard';
import {
  AddAppWizardProvider,
  useAddAppWizard,
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

// Step indices for navigation
const STEP_INDICES = {
  SEARCH: 1,
  PRODUCT: 2,
  DETAILS: 3,
  INSTANCES: 4,
  REPOS: 5,
  JIRA: 6,
  DOCS: 7,
  REVIEW: 8,
  RESULT: 9
};

function AddAppModal({ show, onHide, onAdd, existingAppIds = [] }) {
  return (
    <AddAppWizardProvider onComplete={onAdd} onClose={onHide}>
      <AddAppModalContent show={show} />
    </AddAppWizardProvider>
  );
}

function AddAppModalContent({ show }) {
  const {
    selectedProduct,
    error,
    setError,
    handleClose
  } = useAddAppWizard();

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedProduct ? `Onboard to ${selectedProduct.name}` : 'Add Application'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ minHeight: '450px' }}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
            {error}
          </Alert>
        )}

        <StepWizard isHashEnabled={false} transitions={{}}>
          <SearchStepWrapper stepName="search" />
          <ProductStepWrapper stepName="product" />
          <DetailsStepWrapper stepName="details" />
          <InstancesStepWrapper stepName="instances" />
          <ReposStepWrapper stepName="repos" />
          <JiraStepWrapper stepName="jira" />
          <DocsStepWrapper stepName="docs" />
          <ReviewStepWrapper stepName="review" />
          <ResultStepWrapper stepName="result" />
        </StepWizard>
      </Modal.Body>
    </Modal>
  );
}

// Step wrappers with navigation
function SearchStepWrapper(props) {
  const { selectApp } = useAddAppWizard();

  const handleSelect = (app) => {
    selectApp(app);
    props.nextStep();
  };

  return <SearchStep onSelect={handleSelect} />;
}

function ProductStepWrapper(props) {
  const { selectProduct, selectedApp, handleClose } = useAddAppWizard();
  const isAddingToProduct = selectedApp?.isOnboarded;

  const handleSelect = (product) => {
    selectProduct(product);
    if (isAddingToProduct) {
      // Skip to review step
      props.goToStep(STEP_INDICES.REVIEW);
    } else {
      props.nextStep();
    }
  };

  return (
    <div>
      <ProductStep onSelect={handleSelect} />
      <NavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        showBack={true}
      />
    </div>
  );
}

function DetailsStepWrapper(props) {
  const { handleClose } = useAddAppWizard();
  return (
    <div>
      <DetailsStep />
      <NavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
      />
    </div>
  );
}

function InstancesStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <InstancesStep />
      <NavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('instances')}
      />
    </div>
  );
}

function ReposStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <ReposStep />
      <NavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('repos')}
      />
    </div>
  );
}

function JiraStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <JiraStep />
      <NavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('jira')}
      />
    </div>
  );
}

function DocsStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <DocsStep />
      <NavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('docs')}
      />
    </div>
  );
}

function ReviewStepWrapper(props) {
  const { finish, handleClose, selectedApp } = useAddAppWizard();
  const isAddingToProduct = selectedApp?.isOnboarded;

  const handleBack = () => {
    if (isAddingToProduct) {
      props.goToStep(STEP_INDICES.PRODUCT);
    } else {
      props.previousStep();
    }
  };

  const handleSubmit = async () => {
    await finish();
    props.nextStep();
  };

  return (
    <div>
      <ReviewStep />
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <div>
          <Button variant="outline-secondary" onClick={handleBack} className="me-2">
            Back
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {isAddingToProduct ? 'Add to Product' : 'Add Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResultStepWrapper(props) {
  const { handleClose, submitError, submitSuccess } = useAddAppWizard();

  const handleBack = () => {
    props.previousStep();
  };

  return (
    <div>
      <ResultStep />
      <div className="d-flex justify-content-between mt-4">
        <div>
          {submitError && (
            <Button variant="outline-secondary" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

// Reusable navigation buttons
function NavButtons({ onCancel, onBack, onNext, showBack, showNext, canProceed = true }) {
  return (
    <div className="d-flex justify-content-between mt-4">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <div>
        {showBack && (
          <Button variant="outline-secondary" onClick={onBack} className="me-2">
            Back
          </Button>
        )}
        {showNext && (
          <Button variant="primary" onClick={onNext} disabled={!canProceed}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

export default AddAppModal;
