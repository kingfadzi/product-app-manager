import React from 'react';
import { Card } from 'react-bootstrap';

function SearchResultsEmptyState({ message, subMessage }) {
  return (
    <Card style={{ border: '1px solid #dee2e6' }}>
      <Card.Body className="text-center py-5">
        <div className="text-muted">{message}</div>
        {subMessage && (
          <div className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>
            {subMessage}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default SearchResultsEmptyState;
