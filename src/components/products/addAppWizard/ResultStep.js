import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAddAppWizard } from './AddAppWizardContext';

function ResultStep() {
  const {
    selectedApp,
    selectedProduct,
    submitError,
    submitSuccess,
    submitWarnings,
  } = useAddAppWizard();

  if (submitError) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Failed to Add Application</Alert.Heading>
        <p>{submitError}</p>
      </Alert>
    );
  }

  if (submitSuccess && submitWarnings.length > 0) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Application Added with Warnings</Alert.Heading>
        <p>
          <strong>{selectedApp?.name}</strong> ({selectedApp?.cmdbId}) has been added to{' '}
          <strong>{selectedProduct?.name}</strong>.
        </p>
        <ul className="mb-0">
          {submitWarnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
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
