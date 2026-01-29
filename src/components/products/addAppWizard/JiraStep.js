import React from 'react';
import { Form, Table, Alert, InputGroup, ListGroup, Button } from 'react-bootstrap';
import useSearchableAPI from '../../../hooks/useSearchableAPI';
import RemediationBox from '../../common/RemediationBox';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import { useAddAppWizard } from './AddAppWizardContext';
import DeleteIcon from './DeleteIcon';

function JiraStep() {
  const {
    availableJira,
    selectedJira,
    manualJira,
    totalSelectedJira,
    toggleJira,
    selectAllJira,
    addManualJira,
    removeManualJira
  } = useAddAppWizard();

  return (
    <>
      <JiraLookupSection onAdd={addManualJira} />

      {availableJira.length > 0 && (
        <AvailableJiraTable
          projects={availableJira}
          selectedJira={selectedJira}
          onToggle={toggleJira}
          onSelectAll={selectAllJira}
        />
      )}

      {manualJira.length > 0 && (
        <ManualJiraTable projects={manualJira} onRemove={removeManualJira} />
      )}

      <JiraSummary totalSelected={totalSelectedJira} />

      <RemediationBox
        dataSource="Jira project mappings are managed by the DSI team."
        contactEmail="dsi-team@example.com"
        linkUrl="https://dsi.example.com/component-mapping"
        linkText="Open DSI Component Mapping"
      />
    </>
  );
}

function JiraLookupSection({ onAdd }) {
  const { searchTerm, setSearchTerm, results, reset } = useSearchableAPI('/api/jira/search');

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
      {searchTerm.length >= 2 && results.length > 0 && (
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
      {searchTerm.length >= 2 && results.length === 0 && (
        <small className="text-muted">No Jira projects found</small>
      )}
    </div>
  );
}

function AvailableJiraTable({ projects, selectedJira, onToggle, onSelectAll }) {
  const allSelected = selectedJira.length === projects.length && projects.length > 0;

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
          <th>Project Name</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map(project => (
          <tr key={project.projectKey}>
            <td>
              <Form.Check
                type="checkbox"
                checked={selectedJira.includes(project.projectKey)}
                onChange={() => onToggle(project.projectKey)}
              />
            </td>
            <td>
              <strong>{project.projectKey}</strong> - {project.projectName}
            </td>
            <td>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                View Board &rarr;
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
        <span className="text-muted small">{projects.length} projects</span>
      </div>
      <PaginatedTableWrapper
        data={projects}
        itemsPerPage={5}
        itemLabel="projects"
        renderTable={renderTable}
      />
    </>
  );
}

function ManualJiraTable({ projects, onRemove }) {
  const renderTable = (paginatedData) => (
    <Table bordered hover size="sm">
      <thead className="bg-light">
        <tr>
          <th>Project Name</th>
          <th>Link</th>
          <th style={{ width: '40px' }}></th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map(project => (
          <tr key={project.projectKey}>
            <td>
              <strong>{project.projectKey}</strong> - {project.projectName}
            </td>
            <td>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                View Board &rarr;
              </a>
            </td>
            <td className="text-center align-middle">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-danger"
                onClick={() => onRemove(project.projectKey)}
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
        data={projects}
        itemsPerPage={5}
        itemLabel="projects"
        renderTable={renderTable}
      />
    </>
  );
}

function JiraSummary({ totalSelected }) {
  return (
    <>
      <div className="mt-3 mb-2 text-muted small">
        <strong>Total Selected:</strong> {totalSelected} Jira projects
      </div>

      {totalSelected === 0 && (
        <Alert variant="danger" className="py-2">
          <small>Please select or add at least one Jira project to continue.</small>
        </Alert>
      )}
    </>
  );
}

export default JiraStep;
