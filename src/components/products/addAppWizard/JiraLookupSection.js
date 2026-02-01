import React from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';
import useSearchableAPI from '../../../hooks/useSearchableAPI';

function JiraLookupSection({ onAdd }) {
  const {
    searchTerm,
    setSearchTerm,
    results,
    reset,
    loading,
    error,
  } = useSearchableAPI('/jira/search');

  const handleAdd = (project) => {
    onAdd(project);
    reset();
  };

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <Form.Label className="small fw-bold">Add Jira Project by Key</Form.Label>
      <InputGroup size="sm">
        <Form.Control
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by project key or name..."
        />
      </InputGroup>
      {searchTerm.length >= 2 && loading && (
        <small className="text-muted">Searching Jira...</small>
      )}
      {searchTerm.length >= 2 && error && (
        <small className="text-danger">{error}</small>
      )}
      {searchTerm.length >= 2 && !loading && !error && results.length > 0 && (
        <ListGroup className="mt-2" style={{ maxHeight: '150px', overflow: 'auto' }}>
          {results.map(project => (
            <ListGroup.Item
              key={project.projectKey}
              action
              onClick={() => handleAdd(project)}
              className="py-2 d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{project.projectKey}</strong> - {project.projectName}
              </div>
              <small className="text-primary">+ Add</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {searchTerm.length >= 2 && !loading && !error && results.length === 0 && (
        <small className="text-muted">No Jira projects found</small>
      )}
    </div>
  );
}

export default JiraLookupSection;
