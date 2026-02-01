import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

/**
 * Reusable sync button with loading spinner.
 * Shows a refresh/sync icon that spins while syncing.
 */
function SyncButton({ onSync, syncing, disabled, title = 'Sync' }) {
  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={onSync}
      disabled={disabled || syncing}
      title={title}
      style={{ padding: '0.25rem 0.5rem' }}
    >
      {syncing ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <SyncIcon />
      )}
    </Button>
  );
}

/**
 * Inline SVG sync/refresh icon (arrow-clockwise style)
 */
function SyncIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
      />
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
    </svg>
  );
}

export default SyncButton;
