import React from 'react';
import { Form } from 'react-bootstrap';

function BusinessOutcomeStepQuestionnaire({ wizardData, setWizardData }) {
  const updateQuestion = (key) => (value) => {
    setWizardData({
      ...wizardData,
      questionnaire: { ...wizardData.questionnaire, [key]: value }
    });
  };

  return (
    <div>
      <h6 className="mb-3">Guild Engagement Questionnaire</h6>
      <p className="text-muted small">Answer the following to determine required guild engagements.</p>
      <YesNoSelect
        label="Does this change impact data architecture?"
        value={wizardData.questionnaire.impactsData}
        onChange={updateQuestion('impactsData')}
      />
      <YesNoSelect
        label="Does this change have security implications?"
        value={wizardData.questionnaire.impactsSecurity}
        onChange={updateQuestion('impactsSecurity')}
      />
      <YesNoSelect
        label="Does this change impact accessibility?"
        value={wizardData.questionnaire.impactsAccessibility}
        onChange={updateQuestion('impactsAccessibility')}
      />
      <YesNoSelect
        label="Does this require architecture review?"
        value={wizardData.questionnaire.requiresArchReview}
        onChange={updateQuestion('requiresArchReview')}
      />
      <Form.Group className="mb-3">
        <Form.Label>Deployment strategy</Form.Label>
        <Form.Control
          as="select"
          value={wizardData.questionnaire.deploymentStrategy}
          onChange={(e) => updateQuestion('deploymentStrategy')(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="standard">Standard Release</option>
          <option value="hotfix">Hotfix</option>
          <option value="feature-flag">Feature Flag</option>
        </Form.Control>
      </Form.Group>
    </div>
  );
}

function YesNoSelect({ label, value, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select...</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Form.Control>
    </Form.Group>
  );
}

export default BusinessOutcomeStepQuestionnaire;
