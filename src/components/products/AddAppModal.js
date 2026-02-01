import React from 'react';
import { Modal, Alert } from 'react-bootstrap';
import StepWizard from 'react-step-wizard';
import {
  AddAppWizardProvider,
  useAddAppWizard,
} from './addAppWizard';
import SearchStepWrapper from './addAppWizard/SearchStepWrapper';
import ProductStepWrapper from './addAppWizard/ProductStepWrapper';
import DetailsStepWrapper from './addAppWizard/DetailsStepWrapper';
import InstancesStepWrapper from './addAppWizard/InstancesStepWrapper';
import ReposStepWrapper from './addAppWizard/ReposStepWrapper';
import JiraStepWrapper from './addAppWizard/JiraStepWrapper';
import DocsStepWrapper from './addAppWizard/DocsStepWrapper';
import ReviewStepWrapper from './addAppWizard/ReviewStepWrapper';
import ResultStepWrapper from './addAppWizard/ResultStepWrapper';

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

export default AddAppModal;
