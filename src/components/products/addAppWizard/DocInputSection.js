import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function DocInputSection({ availableTypes, onAdd }) {
  const [docType, setDocType] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const handleAdd = () => {
    if (docType && docUrl) {
      onAdd(docType, docUrl);
      setDocType('');
      setDocUrl('');
    }
  };

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <Form.Label className="small fw-bold">Add Documentation Link</Form.Label>
      <div className="d-flex">
        <Form.Control
          as="select"
          size="sm"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          style={{ width: '200px', marginRight: '0.5rem' }}
        >
          <option value="">Select type...</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Form.Control>
        <Form.Control
          size="sm"
          type="url"
          placeholder="https://confluence.example.com/..."
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          style={{ flex: 1, marginRight: '0.5rem' }}
        />
        <Button
          size="sm"
          variant="primary"
          onClick={handleAdd}
          disabled={!docType || !docUrl}
        >
          + Add
        </Button>
      </div>
    </div>
  );
}

export default DocInputSection;
