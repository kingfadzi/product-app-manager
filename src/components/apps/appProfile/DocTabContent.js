import React from 'react';
import { Table } from 'react-bootstrap';
import DeleteIcon from '../../products/addAppWizard/DeleteIcon';
import DocForm from './DocForm';

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

export default DocTabContent;
