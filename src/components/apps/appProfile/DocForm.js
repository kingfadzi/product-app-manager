import React from 'react';
import { Button, Form } from 'react-bootstrap';

function DocForm({ availableTypes, newDoc, setNewDoc, onAdd }) {
  const isValidType = availableTypes.includes(newDoc.type);

  return (
    <div className="d-flex" style={{ gap: '0.5rem' }}>
      <Form.Control
        as="select"
        size="sm"
        value={isValidType ? newDoc.type : ''}
        onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
        style={{ width: '150px' }}
      >
        <option value="">Type...</option>
        {availableTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </Form.Control>
      <Form.Control
        type="text"
        size="sm"
        placeholder="Title"
        value={isValidType || !newDoc.type ? newDoc.title : ''}
        onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
        style={{ flex: 1 }}
      />
      <Form.Control
        type="url"
        size="sm"
        placeholder="URL"
        value={isValidType || !newDoc.type ? newDoc.url : ''}
        onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
        style={{ flex: 1 }}
      />
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={onAdd}
        disabled={!isValidType || !newDoc.title || !newDoc.url}
      >
        + Add
      </Button>
    </div>
  );
}

export default DocForm;
