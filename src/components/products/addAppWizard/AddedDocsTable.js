import React from 'react';
import { Button, Table } from 'react-bootstrap';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import { DOC_TYPES } from './constants';
import DeleteIcon from './DeleteIcon';

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

export default AddedDocsTable;
