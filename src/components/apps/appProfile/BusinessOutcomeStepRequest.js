import React from 'react';
import { Alert, Form } from 'react-bootstrap';
import { isGuildRecommended } from './businessOutcomeConstants';

function BusinessOutcomeStepRequest({ wizardData, guildSmes, toggleGuild }) {
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

export default BusinessOutcomeStepRequest;
