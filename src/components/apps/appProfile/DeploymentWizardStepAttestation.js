import React from 'react';
import { Alert, Form } from 'react-bootstrap';
import ReleaseSummary from './ReleaseSummary';

const ATTESTATIONS = [
  { key: 'codeReviewed', label: 'All code changes have been peer reviewed and approved' },
  { key: 'testsPass', label: 'All automated tests pass successfully' },
  { key: 'securityScan', label: 'Security scans have been completed with no critical findings' },
  { key: 'documentationUpdated', label: 'Relevant documentation has been updated' },
  { key: 'rollbackPlan', label: 'A rollback plan has been documented and tested' },
];

function DeploymentWizardStepAttestation({ data, environments = [], toggleAttestation }) {
  return (
    <div>
      <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Release Attestation</h6>
      <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>Please confirm the following before creating the release:</p>
      <div className="mb-3">
        {ATTESTATIONS.map(({ key, label }) => (
          <Form.Check key={key} type="checkbox" id={`attest-${key}`}
            label={<span style={{ fontSize: '0.875rem' }}>{label}</span>}
            checked={data.attestations[key]}
            onChange={() => toggleAttestation(key)}
            className="mb-2"
          />
        ))}
      </div>
      <ReleaseSummary data={data} environments={environments} />
      <Alert variant="info" style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
        <strong>What happens next:</strong>
        <ul className="mb-0" style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
          <li>Release record created using existing risk profile</li>
          <li>ServiceNow CRs created per environment</li>
          <li>Gate status determined by evidence coverage</li>
        </ul>
      </Alert>
    </div>
  );
}

export default DeploymentWizardStepAttestation;
