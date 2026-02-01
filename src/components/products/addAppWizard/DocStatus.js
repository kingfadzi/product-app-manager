import React from 'react';
import { Alert } from 'react-bootstrap';

function DocStatus({ missingTypes }) {
  if (missingTypes.length === 0) {
    return (
      <Alert variant="success" className="py-2">
        <small>All required documents have been added.</small>
      </Alert>
    );
  }

  return (
    <Alert variant="warning" className="py-2">
      <small>
        <strong>Missing:</strong> {missingTypes.join(', ')}
      </small>
    </Alert>
  );
}

export default DocStatus;
