import React, { useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { GUILD_SME_TYPES } from './constants';
import { getContactRoleLabel, getGuildRoleLabel, formatShortDate } from './helpers';
import DeleteIcon from '../../products/addAppWizard/DeleteIcon';
import { ContactForm, DocForm, GuildSmeForm } from './forms';

export function ContactsTab({
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

export function DocTabContent({ docs = [], docTypes, editing, newDoc, setNewDoc, onAdd, onRemove }) {
  const safeArray = Array.isArray(docs) ? docs : [];
  const filteredDocs = safeArray.filter(d => docTypes.includes(d.type));
  const existingTypes = filteredDocs.map(d => d.type);
  const availableTypes = docTypes.filter(t => !existingTypes.includes(t));

  return (
    <>
      {filteredDocs.length === 0 ? (
        <p className="text-muted mb-0">No documentation added</p>
      ) : (
        <Table size="sm" className={editing ? "mb-3" : "mb-0"} borderless>
          <tbody>
            {filteredDocs.map(doc => (
              <tr key={doc.id}>
                <td style={{ whiteSpace: 'nowrap' }} className="text-muted">{doc.type}</td>
                <td>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.title} &rarr;
                  </a>
                </td>
                {editing && (
                  <td style={{ width: '30px' }} className="text-center align-middle">
                    <button
                      type="button"
                      onClick={() => onRemove(doc.id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#dc3545' }}
                      title="Remove document"
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

      {editing && availableTypes.length > 0 && (
        <DocForm
          availableTypes={availableTypes}
          newDoc={newDoc}
          setNewDoc={setNewDoc}
          onAdd={onAdd}
        />
      )}
    </>
  );
}

export function GuildsTab({ smes = [], onAdd, onRemove, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [newSme, setNewSme] = useState({ role: '', name: '', email: '' });
  const [error, setError] = useState(null);

  const items = Array.isArray(smes) ? smes : [];
  const existingRoles = items.map(s => s.role);
  const availableRoles = GUILD_SME_TYPES.filter(t => !existingRoles.includes(t.value));

  const handleAdd = async () => {
    if (newSme.role && newSme.name && newSme.email) {
      try {
        await onAdd({
          stakeholder_type: 'guild_sme',
          role: newSme.role,
          name: newSme.name,
          email: newSme.email
        });
        setNewSme({ role: '', name: '', email: '' });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to add guild SME.');
      }
    }
  };

  const handleRemove = async (id) => {
    try {
      await onRemove(id);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to remove guild SME.');
    }
  };

  return (
    <>
      {!readOnly && (
        <div className="d-flex justify-content-end mb-2">
          <Button
            variant={editing ? "outline-secondary" : "outline-primary"}
            size="sm"
            onClick={() => { setEditing(!editing); setNewSme({ role: '', name: '', email: '' }); }}
          >
            {editing ? 'Done' : 'Edit'}
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="py-2">
          <small>{error}</small>
        </Alert>
      )}

      {items.length === 0 ? (
        <p className="text-muted mb-0">No guild SMEs assigned</p>
      ) : (
        <Table size="sm" className={editing ? "mb-3" : "mb-0"} borderless>
          <tbody>
            {items.map(sme => (
              <tr key={sme.id}>
                <td style={{ whiteSpace: 'nowrap' }} className="text-muted">{getGuildRoleLabel(sme.role)}</td>
                <td><a href={`mailto:${sme.email}`}>{sme.name}</a></td>
                <td>{sme.email}</td>
                {editing && (
                  <td style={{ width: '30px' }} className="text-center align-middle">
                    <button
                      type="button"
                      onClick={() => handleRemove(sme.id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#dc3545' }}
                      title="Remove SME"
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

      {editing && availableRoles.length > 0 && (
        <GuildSmeForm
          availableRoles={availableRoles}
          newSme={newSme}
          setNewSme={setNewSme}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}

export function OutcomesTab({ outcomes = [], onViewMore, onItemClick }) {
  const items = Array.isArray(outcomes) ? outcomes : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">No business outcomes available</p>;
  }
  return (
    <>
      <Table size="sm" className="mb-0" borderless>
        <tbody>
          {items.slice(0, 2).map(item => (
            <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => onItemClick(item)}>
              <td><span className="text-primary">{item.id}</span></td>
              <td>{item.summary}</td>
              <td className="text-muted">{item.status}</td>
              <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatShortDate(item.updated)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-right mt-2">
        <Button variant="link" size="sm" className="p-0" onClick={onViewMore}>
          View more →
        </Button>
      </div>
    </>
  );
}

export function RiskStoriesTab({ stories = [], onViewMore, onItemClick }) {
  const items = Array.isArray(stories) ? stories : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">No risk stories available</p>;
  }
  return (
    <>
      <Table size="sm" className="mb-0" borderless>
        <tbody>
          {items.slice(0, 2).map(item => (
            <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => onItemClick(item)}>
              <td><span className="text-primary">{item.id}</span></td>
              <td>{item.summary}</td>
              <td className="text-muted">{item.status}</td>
              <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatShortDate(item.updated)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-right mt-2">
        <Button variant="link" size="sm" className="p-0" onClick={onViewMore}>
          View more →
        </Button>
      </div>
    </>
  );
}

export function ProductsTab({ products = [], history }) {
  const items = Array.isArray(products) ? products : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">Not assigned to any products</p>;
  }

  return (
    <Table size="sm" hover className="mb-0">
      <thead>
        <tr>
          <th>Product</th>
          <th>Stack</th>
        </tr>
      </thead>
      <tbody>
        {items.map(product => (
          <tr
            key={product.id}
            onClick={() => history.push(`/products/${product.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <td>{product.name}</td>
            <td className="text-muted">{product.stack || '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
