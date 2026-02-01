import React, { useState } from 'react';
import { Form, Table, Alert, Button } from 'react-bootstrap';
import RemediationBox from '../../common/RemediationBox';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import { useAddAppWizard } from './AddAppWizardContext';
import { DOC_TYPES } from './constants';
import DeleteIcon from './DeleteIcon';

function DocsStep() {
  const { addedDocs, addDoc, removeDoc } = useAddAppWizard();

  const addedTypes = addedDocs.map(d => d.type);
  const availableTypes = DOC_TYPES.filter(t => !addedTypes.includes(t));
  const missingTypes = availableTypes;

  return (
    <>
      <DocInputSection availableTypes={availableTypes} onAdd={addDoc} />

      {addedDocs.length > 0 && (
        <AddedDocsTable docs={addedDocs} onRemove={removeDoc} />
      )}

      <DocStatus missingTypes={missingTypes} />

      <RemediationBox
        dataSource="Documentation is managed in Confluence."
        contactEmail="documentation-team@example.com"
        linkUrl="https://confluence.example.com"
        linkText="Open Confluence"
      />
    </>
  );
}

function DocInputSection({ availableTypes, onAdd }) {
  const [docType, setDocType] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const handleAdd = () => {
    if (docType && docUrl) {
      onAdd(docType, docUrl);
      setDocType('');
      setDocUrl('');
    }
  };

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <Form.Label className="small fw-bold">Add Documentation Link</Form.Label>
      <div className="d-flex">
        <Form.Control
          as="select"
          size="sm"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          style={{ width: '200px', marginRight: '0.5rem' }}
        >
          <option value="">Select type...</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Form.Control>
        <Form.Control
          size="sm"
          type="url"
          placeholder="https://confluence.example.com/..."
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          style={{ flex: 1, marginRight: '0.5rem' }}
        />
        <Button
          size="sm"
          variant="primary"
          onClick={handleAdd}
          disabled={!docType || !docUrl}
        >
          + Add
        </Button>
      </div>
    </div>
  );
}

function AddedDocsTable({ docs, onRemove }) {
  const renderTable = (paginatedData) => (
    <Table bordered hover size="sm">
      <thead className="bg-light">
        <tr>
          <th>Document Type</th>
          <th>URL</th>
          <th style={{ width: '40px' }}></th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map(doc => (
          <tr key={doc.type}>
            <td>{doc.type}</td>
            <td>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-truncate d-block"
                style={{ maxWidth: '300px' }}
              >
                {doc.url}
              </a>
            </td>
            <td className="text-center align-middle">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-danger"
                onClick={() => onRemove(doc.type)}
                title="Remove"
              >
                <DeleteIcon />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      <div className="mb-2 small fw-bold">Added Documents ({docs.length}/{DOC_TYPES.length})</div>
      <PaginatedTableWrapper
        data={docs}
        itemsPerPage={10}
        itemLabel="docs"
        renderTable={renderTable}
      />
    </>
  );
}

function DocStatus({ missingTypes }) {
  if (missingTypes.length === 0) {
    return (
      <Alert variant="success" className="py-2">
        <small>All required documents have been added.</small>
      </Alert>
    );
  }

  return (
    <Alert variant="warning" className="py-2">
      <small>
        <strong>Missing:</strong> {missingTypes.join(', ')}
      </small>
    </Alert>
  );
}

export default DocsStep;
