import React from 'react';
import { Form, InputGroup, ListGroup, Badge } from 'react-bootstrap';
import useSearchableAPI from '../../../hooks/useSearchableAPI';
import { getRepoTypeBadgeColor } from './helpers';

function RepoLookupSection({ onAdd }) {
  const {
    searchTerm,
    setSearchTerm,
    results,
    reset,
    loading,
    error,
  } = useSearchableAPI('/repos/search');

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
                <Badge bg={getRepoTypeBadgeColor(repo.type)} className="me-2">
                  {repo.type}
                </Badge>
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

export default RepoLookupSection;
