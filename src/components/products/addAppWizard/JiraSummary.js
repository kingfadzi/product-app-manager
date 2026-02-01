import React from 'react';
import { Alert } from 'react-bootstrap';

function JiraSummary({ totalSelected }) {
  return (
    <>
      <div className="mt-3 mb-2 text-muted small">
        <strong>Total Selected:</strong> {totalSelected} Jira projects
      </div>

      {totalSelected === 0 && (
        <Alert variant="danger" className="py-2">
          <small>Please select or add at least one Jira project to continue.</small>
        </Alert>
      )}
    </>
  );
}

export default JiraSummary;
