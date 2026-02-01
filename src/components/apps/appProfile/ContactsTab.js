import React from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { getContactRoleLabel } from './helpers';
import DeleteIcon from '../../products/addAppWizard/DeleteIcon';
import ContactForm from './ContactForm';

function ContactsTab({
  contacts = [],
  editing,
  setEditing,
  newContact,
  setNewContact,
  onAdd,
  onRemove,
  readOnly,
  error,
}) {
  const items = Array.isArray(contacts) ? contacts : [];
  return (
    <>
      {error && (
        <Alert variant="danger" className="py-2">
          <small>{error}</small>
        </Alert>
      )}

      {!readOnly && (
        <div className="d-flex justify-content-end mb-2">
          <Button
            variant={editing ? "outline-secondary" : "outline-primary"}
            size="sm"
            onClick={() => { setEditing(!editing); setNewContact({ type: '', name: '', email: '' }); }}
          >
            {editing ? 'Done' : 'Edit'}
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-muted mb-0">No contacts added</p>
      ) : (
        <Table size="sm" className={editing ? "mb-3" : "mb-0"} borderless>
          <tbody>
            {items.map(contact => (
              <tr key={contact.id}>
                <td style={{ whiteSpace: 'nowrap' }} className="text-muted">{getContactRoleLabel(contact.role)}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                {editing && (
                  <td style={{ width: '30px' }} className="text-center align-middle">
                    <button
                      type="button"
                      onClick={() => onRemove(contact.id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#dc3545' }}
                      title="Remove contact"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {editing && (
        <ContactForm
          newContact={newContact}
          setNewContact={setNewContact}
          onAdd={onAdd}
        />
      )}
    </>
  );
}

export default ContactsTab;
