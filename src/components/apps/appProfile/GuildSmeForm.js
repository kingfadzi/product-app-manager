import React from 'react';
import { Button, Form } from 'react-bootstrap';

function GuildSmeForm({ availableRoles, newSme, setNewSme, onAdd }) {
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

export default GuildSmeForm;
