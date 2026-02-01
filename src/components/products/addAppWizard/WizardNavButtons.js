import React from 'react';
import { Button } from 'react-bootstrap';

function WizardNavButtons({ onCancel, onBack, onNext, showBack, showNext, canProceed = true }) {
  return (
    <div className="d-flex justify-content-between mt-4">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <div>
        {showBack && (
          <Button variant="outline-secondary" onClick={onBack} style={{ marginRight: '0.5rem' }}>
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

export default WizardNavButtons;
