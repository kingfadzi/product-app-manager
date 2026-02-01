import React from 'react';
import { Button, Table } from 'react-bootstrap';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import DeleteIcon from './DeleteIcon';

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

export default ManualJiraTable;
