import React from 'react';
import { Table } from 'react-bootstrap';
import TablePagination from '../common/TablePagination';

function StacksTable({
  stacks,
  getTcName,
  onRowClick,
  pagination,
}) {
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
      <Table striped bordered hover style={{ whiteSpace: 'nowrap' }}>
        <thead>
          <tr>
            <th>Stack</th>
            <th>TC</th>
            <th className="text-center">Products</th>
            <th className="text-center">Apps</th>
            <th className="text-center">Critical Apps</th>
            <th className="text-center">Open Risks</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(stack => (
            <tr
              key={stack.name}
              style={{
                cursor: 'pointer',
                background: stack.openRisks > 5 ? '#fff3cd' : undefined
              }}
              onClick={() => onRowClick(stack)}
            >
              <td style={{ fontWeight: 500 }}>{stack.name}</td>
              <td>{getTcName(stack.tc)}</td>
              <td className="text-center">{stack.productCount}</td>
              <td className="text-center">{stack.appCount}</td>
              <td className="text-center">
                {stack.criticalApps > 0 ? (
                  <span style={{ color: '#dc3545', fontWeight: 500 }}>{stack.criticalApps}</span>
                ) : (
                  stack.criticalApps
                )}
              </td>
              <td className="text-center">
                {stack.openRisks > 0 ? (
                  <span style={{ color: stack.openRisks > 5 ? '#dc3545' : '#fd7e14', fontWeight: 500 }}>
                    {stack.openRisks}
                  </span>
                ) : (
                  stack.openRisks
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showPagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          itemLabel="stacks"
        />
      )}
    </>
  );
}

export default StacksTable;
