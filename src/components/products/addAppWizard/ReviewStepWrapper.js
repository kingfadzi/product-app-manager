import React from 'react';
import { Button } from 'react-bootstrap';
import { useAddAppWizard } from './AddAppWizardContext';
import ReviewStep from './ReviewStep';
import { STEP_INDICES } from './stepIndices';

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
          <Button variant="outline-secondary" onClick={handleBack} style={{ marginRight: '0.5rem' }}>
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

export default ReviewStepWrapper;
