import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { CONTACT_TYPES } from './constants';

export function ContactForm({ newContact, setNewContact, onAdd }) {
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

export function DocForm({ availableTypes, newDoc, setNewDoc, onAdd }) {
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

export function GuildSmeForm({ availableRoles, newSme, setNewSme, onAdd }) {
  const isValidRole = availableRoles.some(r => r.value === newSme.role);

  return (
    <div className="d-flex" style={{ gap: '0.5rem' }}>
      <Form.Control
        as="select"
        size="sm"
        value={isValidRole ? newSme.role : ''}
        onChange={(e) => setNewSme({ ...newSme, role: e.target.value })}
        style={{ width: '160px' }}
      >
        <option value="">Guild...</option>
        {availableRoles.map(role => (
          <option key={role.value} value={role.value}>{role.label}</option>
        ))}
      </Form.Control>
      <Form.Control
        type="text"
        size="sm"
        placeholder="Name"
        value={isValidRole || !newSme.role ? newSme.name : ''}
        onChange={(e) => setNewSme({ ...newSme, name: e.target.value })}
        style={{ flex: 1 }}
      />
      <Form.Control
        type="email"
        size="sm"
        placeholder="Email"
        value={isValidRole || !newSme.role ? newSme.email : ''}
        onChange={(e) => setNewSme({ ...newSme, email: e.target.value })}
        style={{ flex: 1 }}
      />
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={onAdd}
        disabled={!isValidRole || !newSme.name || !newSme.email}
      >
        + Add
      </Button>
    </div>
  );
}
