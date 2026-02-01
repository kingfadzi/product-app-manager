import React, { useState } from 'react';
import { Card, Tab, Nav, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ContactsTab from './ContactsTab';
import OverviewTab from './OverviewTab';
import ProductsTab from './ProductsTab';

function AppDetailsCard({ app, contacts, appProducts, onAddContact, onRemoveContact, readOnly }) {
  const history = useHistory();
  const [editing, setEditing] = useState(false);
  const [newContact, setNewContact] = useState({ type: '', name: '', email: '' });
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    if (newContact.type && newContact.name && newContact.email) {
      try {
        await onAddContact({
          stakeholder_type: 'contact',
          role: newContact.type,
          name: newContact.name,
          email: newContact.email
        });
        setNewContact({ type: '', name: '', email: '' });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to add contact.');
      }
    }
  };

  const handleRemove = async (contactId) => {
    try {
      await onRemoveContact(contactId);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to remove contact.');
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
                onRemove={handleRemove}
                readOnly={readOnly}
                error={error}
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

export default AppDetailsCard;
