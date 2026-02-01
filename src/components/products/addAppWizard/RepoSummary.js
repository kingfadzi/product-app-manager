import React from 'react';
import { Alert } from 'react-bootstrap';

function RepoSummary({ totalSelected, bitbucketSelected }) {
  return (
    <>
      <div className="mt-3 mb-2 text-muted small">
        <strong>Total Selected:</strong> {totalSelected} repositories
      </div>

      {bitbucketSelected && (
        <Alert variant="warning" className="py-2">
          <small>
            <strong>Note:</strong> BitBucket repositories may require migration to GitLab.
          </small>
        </Alert>
      )}

      {totalSelected === 0 && (
        <Alert variant="danger" className="py-2">
          <small>Please select or add at least one repository to continue.</small>
        </Alert>
      )}
    </>
  );
}

export default RepoSummary;
