import React from 'react';
import { Form, Table } from 'react-bootstrap';
import PaginatedTableWrapper from './PaginatedTableWrapper';

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

export default AvailableJiraTable;
