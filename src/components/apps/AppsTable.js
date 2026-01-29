import React from 'react';
import { Table } from 'react-bootstrap';

function AppsTable({ apps, onRowClick, onFilterClick }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover style={{ whiteSpace: 'nowrap' }}>
        <thead>
          <tr>
            <th>App ID</th>
            <th>Name</th>
            <th>Stack</th>
            <th>Product</th>
            <th>ResCat</th>
            <th className="text-center">Repos</th>
            <th className="text-center">Backlogs</th>
            <th className="text-center">Open Risks</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <AppRow
              key={app.id}
              app={app}
              onRowClick={onRowClick}
              onFilterClick={onFilterClick}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function AppRow({ app, onRowClick, onFilterClick }) {
  const handleCellClick = () => onRowClick(app.id);

  const handleStackClick = (e) => {
    e.stopPropagation();
    if (app.stack) onFilterClick('stack', app.stack);
  };

  const handleProductClick = (e) => {
    e.stopPropagation();
    if (app.productId) onFilterClick('product', app.productId);
  };

  return (
    <tr style={{ cursor: 'pointer' }}>
      <td onClick={handleCellClick}>{app.cmdbId}</td>
      <td onClick={handleCellClick} style={{ fontWeight: 500 }}>{app.name}</td>
      <td
        onClick={handleStackClick}
        style={{ color: app.stack ? '#0d6efd' : undefined, cursor: app.stack ? 'pointer' : 'default' }}
      >
        {app.stack || '-'}
      </td>
      <td
        onClick={handleProductClick}
        style={{ color: app.productId ? '#0d6efd' : undefined, cursor: app.productId ? 'pointer' : 'default' }}
      >
        {app.productName || '-'}
      </td>
      <td onClick={handleCellClick}>{app.resCat || '-'}</td>
      <td className="text-center" onClick={handleCellClick}>{app.repoCount || 0}</td>
      <td className="text-center" onClick={handleCellClick}>{app.backlogCount || 0}</td>
      <td className="text-center" onClick={handleCellClick}>{app.openRisks || 0}</td>
    </tr>
  );
}

export default AppsTable;
