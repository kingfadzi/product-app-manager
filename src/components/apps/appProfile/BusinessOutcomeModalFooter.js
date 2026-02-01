import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function BusinessOutcomeModalFooter({
  viewMode,
  wizardStep,
  wizardData,
  onBack,
  onClose,
  onCancel,
  onPrevStep,
  onNextStep,
  onSave,
}) {
  const buttonStyle = { fontSize: '0.875rem' };

  if (viewMode === 'review') {
    return (
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="outline-secondary" onClick={onBack} style={buttonStyle}>
          ← Back to List
        </Button>
        <Button variant="secondary" onClick={onClose} style={buttonStyle}>
          Close
        </Button>
      </Modal.Footer>
    );
  }

  return (
    <Modal.Footer style={{ justifyContent: 'space-between' }}>
      {wizardStep > 1 ? (
        <Button variant="outline-secondary" onClick={onPrevStep} style={buttonStyle}>
          ← Back
        </Button>
      ) : <div />}
      <div>
        <Button variant="secondary" onClick={onCancel} className="mr-2" style={buttonStyle}>
          Cancel
        </Button>
        {wizardStep < 4 ? (
          <Button variant="dark" onClick={onNextStep} style={buttonStyle}>
            Next →
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={onSave}
            style={buttonStyle}
            disabled={wizardData.selectedGuilds.length === 0}
          >
            Submit Request
          </Button>
        )}
      </div>
    </Modal.Footer>
  );
}

export default BusinessOutcomeModalFooter;
