import React from 'react';
import { Alert } from 'react-bootstrap';

function ReleaseSummary({ data, environments = [] }) {
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

export default ReleaseSummary;
