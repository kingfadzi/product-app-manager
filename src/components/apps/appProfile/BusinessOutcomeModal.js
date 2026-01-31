import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { outcomesApi } from '../../../services/api';
import { INITIAL_WIZARD_DATA } from './businessOutcomeConstants';
import BusinessOutcomeReview from './BusinessOutcomeReview';
import BusinessOutcomeWizard from './BusinessOutcomeWizard';

/**
 * Modal for viewing and editing business outcome guild engagement
 */
function BusinessOutcomeModal({ show, outcome, guildSmes, onHide, onBack, readOnly }) {
  const [viewMode, setViewMode] = useState('review');
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState(INITIAL_WIZARD_DATA);

  const loadEngagementData = useCallback(async () => {
    if (!outcome) return;
    try {
      const savedData = await outcomesApi.getEngagement(outcome.id);
      setWizardData({
        productDeltaDoc: savedData.productDeltaDoc || savedData.product_delta_doc || '',
        architectureDeltaDoc: savedData.architectureDeltaDoc || savedData.architecture_delta_doc || '',
        serviceVisionDeltaDoc: savedData.serviceVisionDeltaDoc || savedData.service_vision_delta_doc || '',
        questionnaire: savedData.questionnaire || INITIAL_WIZARD_DATA.questionnaire,
        selectedGuilds: savedData.selectedGuilds || savedData.selected_guilds || []
      });
    } catch (err) {
      console.error('Error fetching outcome engagement:', err);
      setWizardData(INITIAL_WIZARD_DATA);
    }
  }, [outcome]);

  useEffect(() => {
    if (show && outcome) {
      setViewMode('review');
      setWizardStep(1);
      loadEngagementData();
    }
  }, [show, outcome, loadEngagementData]);

  const handleClose = () => {
    setViewMode('review');
    setWizardStep(1);
    onHide();
  };

  const handleSave = async () => {
    if (!outcome) return;
    try {
      await outcomesApi.saveEngagement(outcome.id, wizardData);
      setViewMode('review');
    } catch (err) {
      console.error('Error saving outcome engagement:', err);
    }
  };

  const toggleGuild = (guildId) => {
    setWizardData(prev => ({
      ...prev,
      selectedGuilds: prev.selectedGuilds.includes(guildId)
        ? prev.selectedGuilds.filter(id => id !== guildId)
        : [...prev.selectedGuilds, guildId]
    }));
  };

  if (!outcome) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <ModalHeader
        outcome={outcome}
        viewMode={viewMode}
        readOnly={readOnly}
        onEditClick={() => setViewMode('edit')}
      />
      <Modal.Body style={{ paddingTop: '0.5rem' }}>
        {viewMode === 'review' ? (
          <BusinessOutcomeReview outcome={outcome} wizardData={wizardData} guildSmes={guildSmes} />
        ) : (
          <BusinessOutcomeWizard
            outcome={outcome}
            wizardData={wizardData}
            setWizardData={setWizardData}
            wizardStep={wizardStep}
            guildSmes={guildSmes}
            toggleGuild={toggleGuild}
          />
        )}
      </Modal.Body>
      <ModalFooter
        viewMode={viewMode}
        wizardStep={wizardStep}
        wizardData={wizardData}
        onBack={onBack}
        onClose={handleClose}
        onCancel={() => setViewMode('review')}
        onPrevStep={() => setWizardStep(s => s - 1)}
        onNextStep={() => setWizardStep(s => s + 1)}
        onSave={handleSave}
      />
    </Modal>
  );
}

function ModalHeader({ outcome, viewMode, readOnly, onEditClick }) {
  return (
    <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
      <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingRight: '1rem' }}>
        <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>
          {outcome.id} - {outcome.summary}
        </Modal.Title>
        {viewMode === 'review' && !readOnly && (
          <Button variant="outline-primary" size="sm" onClick={onEditClick}>
            Guild Engagement
          </Button>
        )}
      </div>
    </Modal.Header>
  );
}

function ModalFooter({ viewMode, wizardStep, wizardData, onBack, onClose, onCancel, onPrevStep, onNextStep, onSave }) {
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

export default BusinessOutcomeModal;
