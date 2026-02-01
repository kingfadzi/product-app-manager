import React from 'react';
import { Alert, Form } from 'react-bootstrap';
import { JIRA_BASE_URL } from '../../../constants/config';

const ATTESTATIONS = [
  { key: 'codeReviewed', label: 'All code changes have been peer reviewed and approved' },
  { key: 'testsPass', label: 'All automated tests pass successfully' },
  { key: 'securityScan', label: 'Security scans have been completed with no critical findings' },
  { key: 'documentationUpdated', label: 'Relevant documentation has been updated' },
  { key: 'rollbackPlan', label: 'A rollback plan has been documented and tested' },
];

export function ReleaseSummary({ data, environments = [] }) {
  const selectedEnvNames = (environments || [])
    .filter(e => data.environments.includes(e.id))
    .map(e => e.name)
    .join(', ') || 'None selected';

  return (
    <Alert variant="light" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6', marginTop: '1.5rem' }}>
      <strong style={{ fontSize: '0.875rem' }}>Summary</strong>
      <div style={{ marginTop: '0.5rem' }}>
        <div><strong>Project:</strong> {data.selectedBacklog?.projectKey} - {data.selectedBacklog?.projectName}</div>
        <div><strong>Fix Version:</strong> {data.selectedVersion?.name}</div>
        <div><strong>Navigator ID:</strong> {data.navigatorId || '-'}</div>
        <div><strong>Environments:</strong> {selectedEnvNames}</div>
      </div>
    </Alert>
  );
}

export function StepProject({ backlogs, data, onChange }) {
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

export function StepVersion({ versions, data, onChange }) {
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

export function StepDetails({ data, setData, businessOutcomes }) {
  return (
    <div>
      <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Release Details</h6>
      <Form.Group className="mb-3">
        <Form.Label style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Navigator ID <span className="text-danger">*</span></Form.Label>
        <Form.Control type="text" placeholder="e.g. NAV-12345, EPIC-789" value={data.navigatorId} onChange={(e) => setData({ ...data, navigatorId: e.target.value })} style={{ fontSize: '0.875rem' }} />
        <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>Link to Navigator planning system or tracking ID</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Business Outcomes <span className="text-muted">(in this release)</span></Form.Label>
        <div style={{ fontSize: '0.8125rem' }}>
          {businessOutcomes.slice(0, 3).map(bo => (
            <div key={bo.id} className="mb-1">
              <a href={`${JIRA_BASE_URL}/browse/${bo.id}`} target="_blank" rel="noopener noreferrer">{bo.id}</a>
              <span className="text-muted ml-2">- {bo.summary}</span>
            </div>
          ))}
        </div>
        <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>Derived from Features assigned to this Fix Version</Form.Text>
      </Form.Group>
    </div>
  );
}

export function StepEnvironments({ data, environments = [], toggleEnvironment }) {
  return (
    <div>
      <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Target Environments</h6>
      <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
        Select target service instances. A Change Request will be created in ServiceNow for each selected instance.
      </p>
      <Form.Label style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Target Service Instances <span className="text-danger">*</span></Form.Label>
      <div className="mb-3">
        {(environments || []).map(env => (
          <Form.Check key={env.id} type="checkbox" id={`env-${env.id}`}
            label={<span style={{ fontSize: '0.875rem' }}>{env.name} <small className="text-muted">({env.siId})</small></span>}
            checked={data.environments.includes(env.id)}
            onChange={() => toggleEnvironment(env.id)}
            className="mb-2"
          />
        ))}
      </div>
      <ReleaseSummary data={data} environments={environments} />
    </div>
  );
}

export function StepAttestation({ data, environments = [], toggleAttestation }) {
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
