import React from 'react';
import { Badge, Form, Table } from 'react-bootstrap';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import { getRepoTypeBadgeColor } from './helpers';

function AvailableReposTable({ repos, selectedRepos, onToggle, onSelectAll }) {
  const counts = { GitLab: 0, BitBucket: 0 };
  repos.forEach(r => {
    if (counts[r.type] !== undefined) counts[r.type]++;
  });

  const allSelected = selectedRepos.length === repos.length && repos.length > 0;

  const renderTable = (paginatedData) => (
    <Table bordered hover size="sm">
      <thead className="bg-light">
        <tr>
          <th style={{ width: '40px' }}>
            <Form.Check
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
          <th>Type</th>
          <th>Slug</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map(repo => (
          <tr key={repo.repoId}>
            <td>
              <Form.Check
                type="checkbox"
                checked={selectedRepos.includes(repo.repoId)}
                onChange={() => onToggle(repo.repoId)}
              />
            </td>
            <td>
              <Badge bg={getRepoTypeBadgeColor(repo.type)}>{repo.type}</Badge>
            </td>
            <td>{repo.slug || repo.name}</td>
            <td>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                View &rarr;
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <span className="small fw-bold">Available from DSI</span>
        <span className="text-muted small">
          GitLab ({counts.GitLab}), BitBucket ({counts.BitBucket})
        </span>
      </div>
      <PaginatedTableWrapper
        data={repos}
        itemsPerPage={5}
        itemLabel="repos"
        renderTable={renderTable}
      />
    </>
  );
}

export default AvailableReposTable;
