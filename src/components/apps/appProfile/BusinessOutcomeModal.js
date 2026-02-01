import React, { useState, useEffect } from 'react';
import { Modal, Alert, Spinner } from 'react-bootstrap';
import useBusinessOutcomeEngagement from '../../../hooks/useBusinessOutcomeEngagement';
import BusinessOutcomeReview from './BusinessOutcomeReview';
import BusinessOutcomeWizard from './BusinessOutcomeWizard';
import BusinessOutcomeModalHeader from './BusinessOutcomeModalHeader';
import BusinessOutcomeModalFooter from './BusinessOutcomeModalFooter';

/**
 * Modal for viewing and editing business outcome guild engagement
 */
function BusinessOutcomeModal({ show, outcome, guildSmes, onHide, onBack, readOnly }) {
  const [viewMode, setViewMode] = useState('review');
  const [wizardStep, setWizardStep] = useState(1);
  const {
    wizardData,
    setWizardData,
    loading,
    error,
    save,
    reset,
  } = useBusinessOutcomeEngagement({
    outcomeId: outcome?.id,
    enabled: show && !!outcome,
  });

  useEffect(() => {
    if (show && outcome) {
      setViewMode('review');
      setWizardStep(1);
      reset();
    }
  }, [show, outcome, reset]);

  const handleClose = () => {
    setViewMode('review');
    setWizardStep(1);
    onHide();
  };

  const handleSave = async () => {
    if (!outcome) return;
    const saved = await save(wizardData);
    if (saved) setViewMode('review');
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
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" keyboard={false}>
      <BusinessOutcomeModalHeader
        outcome={outcome}
        viewMode={viewMode}
        readOnly={readOnly}
        onEditClick={() => setViewMode('edit')}
      />
      <Modal.Body style={{ paddingTop: '0.5rem' }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </Modal.Body>
      <BusinessOutcomeModalFooter
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

export default BusinessOutcomeModal;
