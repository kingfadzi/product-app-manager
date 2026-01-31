import React, { useState } from 'react';
import { Card, Tab, Nav, Row, Col, Table, Button, Form, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { CONTACT_TYPES } from './constants';
import { getResCatBadgeClass, getContactRoleLabel } from './helpers';
import DeleteIcon from '../../products/addAppWizard/DeleteIcon';

function AppDetailsCard({ app, contacts, appProducts, onAddContact, onRemoveContact, readOnly }) {
  const history = useHistory();
  const [editing, setEditing] = useState(false);
  const [newContact, setNewContact] = useState({ type: '', name: '', email: '' });

  const handleAdd = async () => {
    if (newContact.type && newContact.name && newContact.email) {
      await onAddContact({
        stakeholder_type: 'contact',
        role: newContact.type,
        name: newContact.name,
        email: newContact.email
      });
      setNewContact({ type: '', name: '', email: '' });
    }
  };

  return (
    <Card className="mb-4 tabbed-card">
      <Tab.Container defaultActiveKey="overview">
        <Card.Header>
          <strong>Application Details</strong>
          <Nav variant="tabs" className="mt-2">
            <Nav.Item><Nav.Link eventKey="overview">Overview</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="contacts">Contacts</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="products">Products</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="overview">
              <OverviewTab app={app} />
            </Tab.Pane>
            <Tab.Pane eventKey="contacts">
              <ContactsTab
                contacts={contacts}
                editing={editing}
                setEditing={setEditing}
                newContact={newContact}
                setNewContact={setNewContact}
                onAdd={handleAdd}
                onRemove={onRemoveContact}
                readOnly={readOnly}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="products">
              <ProductsTab products={appProducts} history={history} />
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

function OverviewTab({ app }) {
  return (
    <Row>
      <Col xs={6}>
        <DetailRow label="App ID" value={app.cmdbId} />
        <DetailRow label="Owner" value={app.productOwner || '-'} />
        <DetailRow label="Tier" value={app.tier || '-'} />
        <DetailRow label="Status" value={app.operationalStatus || '-'} />
      </Col>
      <Col xs={6}>
        <DetailRow label="Name" value={app.name} />
        <DetailRow label="Architect" value={app.systemArchitect || '-'} />
        <div className="mb-1 d-flex align-items-center">
          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Res. Category</span>
          {app.resCat ? (
            <span className={`badge bg-${getResCatBadgeClass(app.resCat)}`}>{app.resCat}</span>
          ) : '-'}
        </div>
      </Col>
    </Row>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="mb-1 d-flex">
      <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ContactsTab({ contacts = [], editing, setEditing, newContact, setNewContact, onAdd, onRemove, readOnly }) {
  const items = Array.isArray(contacts) ? contacts : [];
  return (
    <>
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

function ProductsTab({ products = [], history }) {
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

export default AppDetailsCard;
