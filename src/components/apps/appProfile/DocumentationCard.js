import React, { useState } from 'react';
import { Card, Tab, Nav, Button, Alert } from 'react-bootstrap';
import DocTabContent from './DocTabContent';

const PRODUCT_DOC_TYPES = ['Product Vision', 'Product Roadmap'];
const TECH_DOC_TYPES = ['Architecture Vision', 'Service Vision', 'Security Vision', 'Test Strategy'];

function DocumentationCard({ docs, onAddDoc, onRemoveDoc, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: '', title: '', url: '' });
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    if (newDoc.type && newDoc.title && newDoc.url) {
      try {
        await onAddDoc(newDoc);
        setNewDoc({ type: '', title: '', url: '' });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to add documentation.');
      }
    }
  };

  const handleRemove = async (docId) => {
    try {
      await onRemoveDoc(docId);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to remove documentation.');
    }
  };

  return (
    <Card className="mb-4 tabbed-card">
      <Tab.Container defaultActiveKey="product">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <strong>Documentation</strong>
            {!readOnly && (
              <Button
                variant={editing ? "outline-secondary" : "outline-primary"}
                size="sm"
                onClick={() => { setEditing(!editing); setNewDoc({ type: '', title: '', url: '' }); }}
              >
                {editing ? 'Done' : 'Edit'}
              </Button>
            )}
          </div>
          <Nav variant="tabs" className="mt-2">
            <Nav.Item><Nav.Link eventKey="product">Product</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="technical">Technical</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="py-2">
              <small>{error}</small>
            </Alert>
          )}
          <Tab.Content>
            <Tab.Pane eventKey="product">
              <DocTabContent
                docs={docs}
                docTypes={PRODUCT_DOC_TYPES}
                editing={editing}
                newDoc={newDoc}
                setNewDoc={setNewDoc}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="technical">
              <DocTabContent
                docs={docs}
                docTypes={TECH_DOC_TYPES}
                editing={editing}
                newDoc={newDoc}
                setNewDoc={setNewDoc}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

export default DocumentationCard;
