import React from 'react';
import { Form, Alert } from 'react-bootstrap';
import StepIndicator from '../../common/StepIndicator';
import { isGuildRecommended } from './businessOutcomeConstants';
import { JIRA_BASE_URL } from '../../../constants/config';

const WIZARD_STEPS = ['Details', 'Changes', 'Questionnaire', 'Request'];

/**
 * Edit/Wizard mode for BusinessOutcomeModal
 * Multi-step wizard for guild engagement
 */
function BusinessOutcomeWizard({ outcome, wizardData, setWizardData, wizardStep, guildSmes, toggleGuild }) {
  return (
    <>
      <StepIndicator steps={WIZARD_STEPS} currentStep={wizardStep} />
      {wizardStep === 1 && <StepDetails outcome={outcome} />}
      {wizardStep === 2 && <StepChanges wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 3 && <StepQuestionnaire wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 4 && <StepRequest wizardData={wizardData} guildSmes={guildSmes} toggleGuild={toggleGuild} />}
    </>
  );
}

function StepDetails({ outcome }) {
  return (
    <div>
      <h6 className="mb-3">Business Outcome Details</h6>
      <table className="table table-sm table-borderless">
        <tbody>
          <tr>
            <td className="text-muted" style={{ width: '140px' }}>Fix Releases</td>
            <td><FixReleasesList releases={outcome.fixReleases} /></td>
          </tr>
          <tr>
            <td className="text-muted">Description</td>
            <td>{outcome.description}</td>
          </tr>
          <tr>
            <td className="text-muted">Navigator ID</td>
            <td><NavigatorLink id={outcome.navigatorId} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function FixReleasesList({ releases }) {
  if (!releases?.length) return '-';
  return releases.map((release, i) => (
    <span key={release}>
      {i > 0 && ', '}
      <a href={`${JIRA_BASE_URL}/issues/?jql=fixVersion="${release}"`} target="_blank" rel="noopener noreferrer">
        {release}
      </a>
    </span>
  ));
}

function NavigatorLink({ id }) {
  if (!id) return '-';
  return (
    <a href={`https://navigator.example.com/${id}`} target="_blank" rel="noopener noreferrer">
      {id}
    </a>
  );
}

function StepChanges({ wizardData, setWizardData }) {
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

function StepQuestionnaire({ wizardData, setWizardData }) {
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

function StepRequest({ wizardData, guildSmes, toggleGuild }) {
  return (
    <div>
      <h6 className="mb-3">Request Guild Engagement</h6>
      <p className="text-muted small">Select the guild members you want to engage with:</p>
      {guildSmes.map(sme => (
        <GuildCheckbox
          key={sme.id}
          sme={sme}
          checked={wizardData.selectedGuilds.includes(sme.id)}
          recommended={isGuildRecommended(sme.guild, wizardData.questionnaire)}
          onChange={() => toggleGuild(sme.id)}
        />
      ))}
      {wizardData.selectedGuilds.length > 0 && (
        <Alert variant="info" className="mt-3">
          Click "Submit Request" to notify {wizardData.selectedGuilds.length} guild member(s) and create engagement tickets.
        </Alert>
      )}
    </div>
  );
}

function GuildCheckbox({ sme, checked, recommended, onChange }) {
  return (
    <Form.Check
      type="checkbox"
      id={`sme-${sme.id}`}
      className="mb-2"
      checked={checked}
      onChange={onChange}
      label={
        <span>
          {sme.name} <span className="text-muted">({sme.guild})</span>
          {recommended && <span className="text-success ml-2" style={{ fontSize: '12px' }}>(Recommended)</span>}
        </span>
      }
    />
  );
}

export default BusinessOutcomeWizard;
