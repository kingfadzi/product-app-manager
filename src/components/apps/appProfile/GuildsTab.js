import React, { useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { GUILD_SME_TYPES } from './constants';
import { getGuildRoleLabel } from './helpers';
import DeleteIcon from '../../products/addAppWizard/DeleteIcon';
import GuildSmeForm from './GuildSmeForm';

function GuildsTab({ smes = [], onAdd, onRemove, readOnly }) {
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

export default GuildsTab;
