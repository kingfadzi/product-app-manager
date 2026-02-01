import React from 'react';
import { Card, Table } from 'react-bootstrap';
import TablePagination from '../../common/TablePagination';

function ProductAppsTable({ apps, onRowClick, pagination }) {
  const {
    currentPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    totalItems,
    showPagination,
    onPageChange,
  } = pagination;

  return (
    <>
      <Card>
        <Table hover className="mb-0" size="sm" style={{ whiteSpace: 'nowrap' }}>
          <thead className="bg-light">
            <tr>
              <th>App ID</th>
              <th>Name</th>
              <th>Parent</th>
              <th>ResCat</th>
              <th className="text-center">Repos</th>
              <th className="text-center">Backlogs</th>
              <th className="text-center">Open Risks</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(app => (
              <tr
                key={app.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onRowClick(app)}
              >
                <td>{app.cmdbId}</td>
                <td style={{ fontWeight: 500 }}>{app.name}</td>
                <td>{app.parent || '-'}</td>
                <td>{app.resCat || '-'}</td>
                <td className="text-center">{app.repoCount || 0}</td>
                <td className="text-center">{app.backlogCount || 0}</td>
                <td className="text-center">{app.openRisks || 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {showPagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          itemLabel="apps"
        />
      )}
    </>
  );
}

export default ProductAppsTable;
