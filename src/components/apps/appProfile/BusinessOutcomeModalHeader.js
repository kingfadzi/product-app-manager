import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function BusinessOutcomeModalHeader({ outcome, viewMode, readOnly, onEditClick }) {
  return (
    <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
      <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingRight: '1rem' }}>
        <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>
          {outcome.id} - {outcome.summary}
        </Modal.Title>
        {viewMode === 'review' && !readOnly && (
          <Button variant="outline-primary" size="sm" onClick={onEditClick}>
            Guild Engagement
          </Button>
        )}
      </div>
    </Modal.Header>
  );
}

export default BusinessOutcomeModalHeader;
