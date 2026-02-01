import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { CONTACT_TYPES } from './constants';

function ContactForm({ newContact, setNewContact, onAdd }) {
  return (
    <div className="d-flex" style={{ gap: '0.5rem' }}>
      <Form.Control
        as="select"
        size="sm"
        value={newContact.type}
        onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
        style={{ width: '140px' }}
      >
        <option value="">Type...</option>
        {CONTACT_TYPES.map(ct => (
          <option key={ct.value} value={ct.value}>{ct.label}</option>
        ))}
      </Form.Control>
      <Form.Control
        type="text"
        size="sm"
        placeholder="Name"
        value={newContact.name}
        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
        style={{ flex: 1 }}
      />
      <Form.Control
        type="email"
        size="sm"
        placeholder="Email"
        value={newContact.email}
        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
        style={{ flex: 1 }}
      />
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={onAdd}
        disabled={!newContact.type || !newContact.name || !newContact.email}
      >
        + Add
      </Button>
    </div>
  );
}

export default ContactForm;
