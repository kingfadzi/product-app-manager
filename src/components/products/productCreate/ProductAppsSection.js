import React from 'react';
import { Badge, Button, Table } from 'react-bootstrap';

function ProductAppsSection({ addedApps, onOpenModal, onRemoveApp }) {
  const appCount = addedApps.length;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          Applications
          {appCount > 0 && <Badge variant="info" className="ml-2">{appCount}</Badge>}
        </h5>
        <Button variant="outline-primary" size="sm" onClick={onOpenModal}>
          Add Application
        </Button>
      </div>

      {appCount === 0 ? (
        <div className="text-center py-4 border rounded bg-light">
          <p className="text-muted mb-2">No applications added yet</p>
          <Button variant="primary" size="sm" onClick={onOpenModal}>
            Add Application
          </Button>
        </div>
      ) : (
        <Table size="sm" bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>CMDB ID</th>
              <th>Repos</th>
              <th>Jira</th>
              <th>Contacts</th>
              <th>Docs</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {addedApps.map(app => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td><code>{app.cmdbId}</code></td>
                <td><Badge variant="secondary">{app.metadata?.repos?.length || 0}</Badge></td>
                <td><Badge variant="secondary">{app.metadata?.backlogs?.length || 0}</Badge></td>
                <td><Badge variant="secondary">{app.metadata?.contacts?.length || 0}</Badge></td>
                <td><Badge variant="secondary">{app.metadata?.docs?.length || 0}</Badge></td>
                <td>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-danger"
                    onClick={() => onRemoveApp(app.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default ProductAppsSection;
