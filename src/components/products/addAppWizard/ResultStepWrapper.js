import React from 'react';
import { Button } from 'react-bootstrap';
import { useAddAppWizard } from './AddAppWizardContext';
import ResultStep from './ResultStep';

function ResultStepWrapper(props) {
  const { handleClose, submitError } = useAddAppWizard();
  const handleBack = () => props.previousStep();
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

export default ResultStepWrapper;
