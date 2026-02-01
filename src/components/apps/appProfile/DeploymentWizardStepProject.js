import React from 'react';
import { Alert, Form } from 'react-bootstrap';

function DeploymentWizardStepProject({ backlogs, data, onChange }) {
  return (
    <div>
      <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Select Jira Project</h6>
      <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
        Choose the Jira project that contains the backlog for this release.
      </p>
      {backlogs.length === 0 ? (
        <Alert variant="warning" style={{ fontSize: '0.8125rem' }}>
          No backlogs linked to this application. Please add a backlog first.
        </Alert>
      ) : (
        <>
          <Form.Control as="select" value={data.selectedBacklog?.projectKey || ''} onChange={(e) => onChange(e.target.value)} style={{ fontSize: '0.875rem' }}>
            <option value="">Select a project...</option>
            {backlogs.map(b => <option key={b.id} value={b.projectKey}>{b.projectKey} - {b.projectName}</option>)}
          </Form.Control>
          {data.selectedBacklog && (
            <Alert variant="light" className="mt-3" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6' }}>
              <strong>{data.selectedBacklog.projectKey}</strong> - {data.selectedBacklog.projectName}
              <br /><small className="text-muted">Purpose: {data.selectedBacklog.purpose}</small>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}

export default DeploymentWizardStepProject;
