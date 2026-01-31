import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAddAppWizard } from './AddAppWizardContext';

function ResultStep() {
  const { selectedApp, selectedProduct, submitError, submitSuccess } = useAddAppWizard();

  if (submitError) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Failed to Add Application</Alert.Heading>
        <p>{submitError}</p>
      </Alert>
    );
  }

  if (submitSuccess) {
    return (
      <Alert variant="success">
        <Alert.Heading>Application Added Successfully</Alert.Heading>
        <p>
          <strong>{selectedApp?.name}</strong> ({selectedApp?.cmdbId}) has been added to{' '}
          <strong>{selectedProduct?.name}</strong>.
        </p>
      </Alert>
    );
  }

  return null;
}

export default ResultStep;
