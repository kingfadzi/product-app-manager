import React from 'react';
import { Form } from 'react-bootstrap';

function BusinessOutcomeStepChanges({ wizardData, setWizardData }) {
  const updateField = (field) => (e) => {
    setWizardData({ ...wizardData, [field]: e.target.value });
  };

  return (
    <div>
      <h6 className="mb-3">Add Changes to Application</h6>
      <p className="text-muted small">Add delta documentation links for this change.</p>
      <DeltaDocInput
        label="Product Delta Doc"
        value={wizardData.productDeltaDoc}
        onChange={updateField('productDeltaDoc')}
      />
      <DeltaDocInput
        label="Architecture Delta Doc"
        value={wizardData.architectureDeltaDoc}
        onChange={updateField('architectureDeltaDoc')}
      />
      <DeltaDocInput
        label="Service Vision Delta Doc"
        value={wizardData.serviceVisionDeltaDoc}
        onChange={updateField('serviceVisionDeltaDoc')}
      />
    </div>
  );
}

function DeltaDocInput({ label, value, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="url"
        placeholder="https://confluence.example.com/..."
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
}

export default BusinessOutcomeStepChanges;
