import React from 'react';
import { Button } from 'react-bootstrap';

function CrudListHeader({ title, onAdd }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5>{title}</h5>
      <Button size="sm" onClick={onAdd}>
        Add {title.replace(/s$/, '')}
      </Button>
    </div>
  );
}

export default CrudListHeader;
