import React from 'react';
import { Button } from 'react-bootstrap';

function EmptyState({
  title = 'No items found',
  description = 'Get started by creating a new item.',
  actionLabel,
  onAction,
  icon = null,
}) {
  return (
    <div className="text-center py-5">
      {icon && <div className="mb-3" style={{ fontSize: '3rem' }}>{icon}</div>}
      <h4 className="text-muted">{title}</h4>
      <p className="text-muted">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
