import React from 'react';
import { Table } from 'react-bootstrap';
import TablePagination from '../common/TablePagination';

function SearchResultsTable({ apps, pagination, onRowClick }) {
  return (
    <>
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
          {pagination.paginatedData.map(app => (
            <tr
              key={app.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onRowClick(app)}
            >
              <td>{app.cmdbId}</td>
              <td style={{ fontWeight: 500 }}>{app.name}</td>
              <td>{app.stack || '-'}</td>
              <td>{app.productName || '-'}</td>
              <td>{app.resCat || '-'}</td>
              <td className="text-center">{app.repoCount || 0}</td>
              <td className="text-center">{app.backlogCount || 0}</td>
              <td className="text-center">{app.openRisks || 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {pagination.showPagination && (
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setCurrentPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemLabel="apps"
        />
      )}
    </>
  );
}

export default SearchResultsTable;
