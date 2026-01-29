import React, { useState } from 'react';
import { Card, Tab, Nav, Table, Button, Form } from 'react-bootstrap';
import { formatShortDate, getHealthColor, getGuildRoleLabel } from './helpers';
import { GUILD_SME_TYPES } from './constants';
import DeleteIcon from '../../products/addAppWizard/DeleteIcon';

function GovernanceCard({ businessOutcomes, riskStories, guildSmes, onViewOutcomes, onViewRisks, onOutcomeClick, onAddGuildSme, onRemoveGuildSme }) {
  return (
    <Card className="mb-4 tabbed-card">
      <Tab.Container defaultActiveKey="outcomes">
        <Card.Header>
          <strong>Governance & Controls</strong>
          <Nav variant="tabs" className="mt-2">
            <Nav.Item><Nav.Link eventKey="outcomes">Business Outcomes</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="risk">Risk Stories</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="guilds">Guilds</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="audit">Audit Log</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="outcomes">
              <OutcomesTab
                outcomes={businessOutcomes}
                onViewMore={onViewOutcomes}
                onItemClick={onOutcomeClick}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="risk">
              <RiskStoriesTab stories={riskStories} onViewMore={onViewRisks} />
            </Tab.Pane>
            <Tab.Pane eventKey="guilds">
              <GuildsTab
                smes={guildSmes}
                onAdd={onAddGuildSme}
                onRemove={onRemoveGuildSme}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="audit">
              <p className="text-muted mb-0">No audit entries available</p>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

function OutcomesTab({ outcomes = [], onViewMore, onItemClick }) {
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

function RiskStoriesTab({ stories = [], onViewMore }) {
  const items = Array.isArray(stories) ? stories : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">No risk stories available</p>;
  }
  return (
    <>
      <Table size="sm" className="mb-0" borderless>
        <tbody>
          {items.slice(0, 2).map(item => (
            <tr key={item.id}>
              <td>
                <a href={`https://jira.example.com/browse/${item.id}`} target="_blank" rel="noopener noreferrer">
                  {item.id}
                </a>
              </td>
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

function GuildsTab({ smes = [], onAdd, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [newSme, setNewSme] = useState({ role: '', name: '', email: '' });

  const items = Array.isArray(smes) ? smes : [];
  const existingRoles = items.map(s => s.role);
  const availableRoles = GUILD_SME_TYPES.filter(t => !existingRoles.includes(t.value));

  const handleAdd = async () => {
    if (newSme.role && newSme.name && newSme.email) {
      await onAdd({
        stakeholder_type: 'guild_sme',
        role: newSme.role,
        name: newSme.name,
        email: newSme.email
      });
      setNewSme({ role: '', name: '', email: '' });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button
          variant={editing ? "outline-secondary" : "outline-primary"}
          size="sm"
          onClick={() => { setEditing(!editing); setNewSme({ role: '', name: '', email: '' }); }}
        >
          {editing ? 'Done' : 'Edit'}
        </Button>
      </div>

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
                      onClick={() => onRemove(sme.id)}
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

function HealthIndicator({ health }) {
  return (
    <span
      title={health}
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: getHealthColor(health)
      }}
    />
  );
}

function BlockedIndicator({ blocked }) {
  if (blocked) {
    return <span title="Blocked" style={{ color: '#dc3545' }}>&#x26D4;</span>;
  }
  return <span title="Not blocked" style={{ color: '#28a745' }}>&#x2713;</span>;
}

export default GovernanceCard;
