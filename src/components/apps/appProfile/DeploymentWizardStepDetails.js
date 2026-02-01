import React from 'react';
import { Form } from 'react-bootstrap';
import { JIRA_BASE_URL } from '../../../constants/config';

function DeploymentWizardStepDetails({ data, setData, businessOutcomes }) {
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

export default DeploymentWizardStepDetails;
