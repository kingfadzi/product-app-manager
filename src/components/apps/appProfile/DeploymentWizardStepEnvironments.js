import React from 'react';
import { Form } from 'react-bootstrap';
import ReleaseSummary from './ReleaseSummary';

function DeploymentWizardStepEnvironments({ data, environments = [], toggleEnvironment }) {
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

export default DeploymentWizardStepEnvironments;
