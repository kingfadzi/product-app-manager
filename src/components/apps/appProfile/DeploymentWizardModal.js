import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import StepIndicator from '../../common/StepIndicator';

const INITIAL_DATA = {
  selectedBacklog: null,
  selectedVersion: null,
  navigatorId: '',
  environments: [],
  attestations: {
    codeReviewed: false,
    testsPass: false,
    securityScan: false,
    documentationUpdated: false,
    rollbackPlan: false
  }
};

function DeploymentWizardModal({ show, onHide, backlogs, businessOutcomes, deploymentEnvironments, fixVersions, loadFixVersions }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);

  useEffect(() => {
    if (show) {
      setStep(1);
      setData(INITIAL_DATA);
    }
  }, [show]);

  const handleClose = () => {
    setStep(1);
    setData(INITIAL_DATA);
    onHide();
  };

  const handleBacklogChange = (projectKey) => {
    const backlog = backlogs.find(b => b.projectKey === projectKey);
    setData({ ...data, selectedBacklog: backlog, selectedVersion: null });
    if (backlog && loadFixVersions) {
      loadFixVersions(projectKey);
    }
  };

  const handleVersionChange = (versionId) => {
    const versions = fixVersions[data.selectedBacklog?.projectKey] || [];
    const version = versions.find(v => v.id === versionId);
    setData({ ...data, selectedVersion: version });
  };

  const toggleEnvironment = (envId) => {
    setData(prev => ({
      ...prev,
      environments: prev.environments.includes(envId)
        ? prev.environments.filter(id => id !== envId)
        : [...prev.environments, envId]
    }));
  };

  const toggleAttestation = (key) => {
    setData(prev => ({
      ...prev,
      attestations: { ...prev.attestations, [key]: !prev.attestations[key] }
    }));
  };

  const allAttestationsChecked = () => Object.values(data.attestations).every(v => v === true);
  const getAvailableVersions = () => fixVersions[data.selectedBacklog?.projectKey] || [];

  const canProceed = () => {
    if (step === 1) return !!data.selectedBacklog;
    if (step === 2) return !!data.selectedVersion;
    if (step === 3) return !!data.navigatorId;
    if (step === 4) return data.environments.length > 0;
    return true;
  };

  const handleCreate = () => {
    alert('Release created successfully!');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>Create New Release</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: 0 }}>
        <StepIndicator steps={['Project', 'Version', 'Details', 'Environments', 'Attestation']} currentStep={step} />
        {step === 1 && <Step1Project backlogs={backlogs} data={data} onChange={handleBacklogChange} />}
        {step === 2 && <Step2Version versions={getAvailableVersions()} data={data} onChange={handleVersionChange} />}
        {step === 3 && <Step3Details data={data} setData={setData} businessOutcomes={businessOutcomes} />}
        {step === 4 && <Step4Environments data={data} environments={deploymentEnvironments} toggleEnvironment={toggleEnvironment} />}
        {step === 5 && <Step5Attestation data={data} environments={deploymentEnvironments} toggleAttestation={toggleAttestation} />}
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        {step > 1 ? (
          <Button variant="outline-secondary" onClick={() => setStep(s => s - 1)} style={{ fontSize: '0.875rem' }}>
            ← Back
          </Button>
        ) : <div />}
        <div>
          <Button variant="secondary" onClick={handleClose} className="mr-2" style={{ fontSize: '0.875rem' }}>Cancel</Button>
          {step < 5 ? (
            <Button variant="dark" onClick={() => setStep(s => s + 1)} style={{ fontSize: '0.875rem' }} disabled={!canProceed()}>
              Next →
            </Button>
          ) : (
            <Button variant="success" onClick={handleCreate} style={{ fontSize: '0.875rem' }} disabled={!allAttestationsChecked()}>
              Create Release
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

function Step1Project({ backlogs, data, onChange }) {
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

function Step2Version({ versions, data, onChange }) {
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

function Step3Details({ data, setData, businessOutcomes }) {
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
              <a href={`https://jira.example.com/browse/${bo.id}`} target="_blank" rel="noopener noreferrer">{bo.id}</a>
              <span className="text-muted ml-2">- {bo.summary}</span>
            </div>
          ))}
        </div>
        <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>Derived from Features assigned to this Fix Version</Form.Text>
      </Form.Group>
    </div>
  );
}

function Step4Environments({ data, environments = [], toggleEnvironment }) {
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

function Step5Attestation({ data, environments = [], toggleAttestation }) {
  const attestations = [
    { key: 'codeReviewed', label: 'All code changes have been peer reviewed and approved' },
    { key: 'testsPass', label: 'All automated tests pass successfully' },
    { key: 'securityScan', label: 'Security scans have been completed with no critical findings' },
    { key: 'documentationUpdated', label: 'Relevant documentation has been updated' },
    { key: 'rollbackPlan', label: 'A rollback plan has been documented and tested' },
  ];

  return (
    <div>
      <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Release Attestation</h6>
      <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>Please confirm the following before creating the release:</p>
      <div className="mb-3">
        {attestations.map(({ key, label }) => (
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

function ReleaseSummary({ data, environments = [] }) {
  const selectedEnvNames = (environments || []).filter(e => data.environments.includes(e.id)).map(e => e.name).join(', ') || 'None selected';
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

export default DeploymentWizardModal;
