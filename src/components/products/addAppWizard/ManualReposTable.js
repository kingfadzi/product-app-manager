import React from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import { getRepoTypeBadgeColor } from './helpers';
import DeleteIcon from './DeleteIcon';

function ManualReposTable({ repos, onRemove }) {
  const renderTable = (paginatedData) => (
    <Table bordered hover size="sm">
      <thead className="bg-light">
        <tr>
          <th>Type</th>
          <th>Slug</th>
          <th>Link</th>
          <th style={{ width: '40px' }}></th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map(repo => (
          <tr key={repo.repoId}>
            <td>
              <Badge bg={getRepoTypeBadgeColor(repo.type)}>{repo.type}</Badge>
            </td>
            <td>{repo.slug || repo.name}</td>
            <td>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                View &rarr;
              </a>
            </td>
            <td className="text-center align-middle">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-danger"
                onClick={() => onRemove(repo.repoId)}
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
      <div className="mb-2 mt-3 small fw-bold">Manually Added</div>
      <PaginatedTableWrapper
        data={repos}
        itemsPerPage={5}
        itemLabel="repos"
        renderTable={renderTable}
      />
    </>
  );
}

export default ManualReposTable;
