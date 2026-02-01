import React from 'react';
import { Form, Table, Alert, InputGroup, ListGroup, Badge, Button } from 'react-bootstrap';
import { useSearchableAPI } from '../../../hooks/useSearchHooks';
import RemediationBox from '../../common/RemediationBox';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import { useAddAppWizard } from './AddAppWizardContext';
import { getRepoTypeBadgeColor } from './helpers';
import DeleteIcon from './DeleteIcon';

function ReposStep() {
  const {
    availableRepos,
    selectedRepos,
    manualRepos,
    totalSelectedRepos,
    toggleRepo,
    selectAllRepos,
    addManualRepo,
    removeManualRepo,
    getAllSelectedRepos
  } = useAddAppWizard();

  const allSelectedRepos = getAllSelectedRepos();
  const bitbucketSelected = allSelectedRepos.some(r => r?.type === 'BitBucket');

  return (
    <>
      <RepoLookupSection onAdd={addManualRepo} />

      {availableRepos.length > 0 && (
        <AvailableReposTable
          repos={availableRepos}
          selectedRepos={selectedRepos}
          onToggle={toggleRepo}
          onSelectAll={selectAllRepos}
        />
      )}

      {manualRepos.length > 0 && (
        <ManualReposTable repos={manualRepos} onRemove={removeManualRepo} />
      )}

      <RepoSummary totalSelected={totalSelectedRepos} bitbucketSelected={bitbucketSelected} />

      <RemediationBox
        dataSource="Repository mappings are managed by the DSI team."
        contactEmail="dsi-team@example.com"
        linkUrl="https://dsi.example.com/component-mapping"
        linkText="Open DSI Component Mapping"
      />
    </>
  );
}

function RepoLookupSection({ onAdd }) {
  const { searchTerm, setSearchTerm, results, reset, loading, error } = useSearchableAPI('/repos/search');

  const handleAdd = (repo) => {
    onAdd(repo);
    reset();
  };

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <Form.Label className="small fw-bold">Add Repository by Slug</Form.Label>
      <InputGroup size="sm">
        <Form.Control
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by repo slug or name..."
        />
      </InputGroup>
      {searchTerm.length >= 2 && loading && (
        <small className="text-muted">Searching repositories...</small>
      )}
      {searchTerm.length >= 2 && error && (
        <small className="text-danger">{error}</small>
      )}
      {searchTerm.length >= 2 && !loading && !error && results.length > 0 && (
        <ListGroup className="mt-2" style={{ maxHeight: '150px', overflow: 'auto' }}>
          {results.map(repo => (
            <ListGroup.Item
              key={repo.repoId}
              action
              onClick={() => handleAdd(repo)}
              className="py-2 d-flex justify-content-between align-items-center"
            >
              <div>
                <Badge bg={getRepoTypeBadgeColor(repo.type)} className="me-2">{repo.type}</Badge>
                {repo.name}
              </div>
              <small className="text-primary">+ Add</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {searchTerm.length >= 2 && !loading && !error && results.length === 0 && (
        <small className="text-muted">No repositories found</small>
      )}
    </div>
  );
}

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
            <Form.Check type="checkbox" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)} />
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
              <Form.Check type="checkbox" checked={selectedRepos.includes(repo.repoId)} onChange={() => onToggle(repo.repoId)} />
            </td>
            <td><Badge bg={getRepoTypeBadgeColor(repo.type)}>{repo.type}</Badge></td>
            <td>{repo.slug || repo.name}</td>
            <td><a href={repo.url} target="_blank" rel="noopener noreferrer">View &rarr;</a></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <span className="small fw-bold">Available from DSI</span>
        <span className="text-muted small">GitLab ({counts.GitLab}), BitBucket ({counts.BitBucket})</span>
      </div>
      <PaginatedTableWrapper data={repos} itemsPerPage={5} itemLabel="repos" renderTable={renderTable} />
    </>
  );
}

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
            <td><Badge bg={getRepoTypeBadgeColor(repo.type)}>{repo.type}</Badge></td>
            <td>{repo.slug || repo.name}</td>
            <td><a href={repo.url} target="_blank" rel="noopener noreferrer">View &rarr;</a></td>
            <td className="text-center align-middle">
              <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => onRemove(repo.repoId)} title="Remove">
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
      <PaginatedTableWrapper data={repos} itemsPerPage={5} itemLabel="repos" renderTable={renderTable} />
    </>
  );
}

function RepoSummary({ totalSelected, bitbucketSelected }) {
  return (
    <>
      <div className="mt-3 mb-2 text-muted small">
        <strong>Total Selected:</strong> {totalSelected} repositories
      </div>
      {bitbucketSelected && (
        <Alert variant="warning" className="py-2">
          <small><strong>Note:</strong> BitBucket repositories may require migration to GitLab.</small>
        </Alert>
      )}
      {totalSelected === 0 && (
        <Alert variant="danger" className="py-2">
          <small>Please select or add at least one repository to continue.</small>
        </Alert>
      )}
    </>
  );
}

export default ReposStep;
