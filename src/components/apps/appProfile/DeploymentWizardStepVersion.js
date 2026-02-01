import React from 'react';
import { Alert, Form } from 'react-bootstrap';

function DeploymentWizardStepVersion({ versions, data, onChange }) {
  return (
    <div>
      <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Select Fix Version</h6>
      <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
        Choose the Jira Fix Version that contains the features for this release.
      </p>
      {versions.length === 0 ? (
        <Alert variant="warning" style={{ fontSize: '0.8125rem' }}>
          No fix versions found for {data.selectedBacklog?.projectKey}.
        </Alert>
      ) : (
        <>
          <Form.Control as="select" value={data.selectedVersion?.id || ''} onChange={(e) => onChange(e.target.value)} style={{ fontSize: '0.875rem' }}>
            <option value="">Select a version...</option>
            {versions.map(v => <option key={v.id} value={v.id}>{v.name} ({v.status})</option>)}
          </Form.Control>
          {data.selectedVersion && (
            <Alert variant="light" className="mt-3" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6' }}>
              <strong>{data.selectedVersion.name}</strong><br />
              <small className="text-muted">Release Date: {data.selectedVersion.releaseDate} | Issues: {data.selectedVersion.issueCount} | Status: {data.selectedVersion.status}</small>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}

export default DeploymentWizardStepVersion;
