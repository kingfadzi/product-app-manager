import React, { useState } from 'react';
import { Card, Tab, Nav, Table, Button, Form } from 'react-bootstrap';
import DeleteIcon from '../../products/addAppWizard/DeleteIcon';

const PRODUCT_DOC_TYPES = ['Product Vision', 'Product Roadmap'];
const TECH_DOC_TYPES = ['Architecture Vision', 'Service Vision', 'Security Vision', 'Test Strategy'];

function DocumentationCard({ docs, onAddDoc, onRemoveDoc, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: '', title: '', url: '' });

  const handleAdd = async () => {
    if (newDoc.type && newDoc.title && newDoc.url) {
      await onAddDoc(newDoc);
      setNewDoc({ type: '', title: '', url: '' });
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
          <Tab.Content>
            <Tab.Pane eventKey="product">
              <DocTabContent
                docs={docs}
                docTypes={PRODUCT_DOC_TYPES}
                editing={editing}
                newDoc={newDoc}
                setNewDoc={setNewDoc}
                onAdd={handleAdd}
                onRemove={onRemoveDoc}
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
                onRemove={onRemoveDoc}
              />
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

function DocTabContent({ docs = [], docTypes, editing, newDoc, setNewDoc, onAdd, onRemove }) {
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

function DocForm({ availableTypes, newDoc, setNewDoc, onAdd }) {
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

export default DocumentationCard;
