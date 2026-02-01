import React from 'react';
import { Button, Table } from 'react-bootstrap';
import EmptyState from './EmptyState';
import TablePagination from './TablePagination';

function CrudListTable({
  title,
  itemLabel,
  items,
  columns,
  onEdit,
  onDelete,
  pagination,
  onAdd,
  emptyTitle,
  emptyDescription,
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={`Add ${title.replace(/s$/, '')}`}
        onAction={onAdd}
      />
    );
  }

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagination.paginatedData.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              <td>
                <Button variant="link" size="sm" onClick={() => onEdit(item)}>
                  Edit
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger"
                  onClick={() => onDelete(item)}
                >
                  Delete
                </Button>
              </td>
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
          size="sm"
          showInfo={false}
          itemLabel={itemLabel}
        />
      )}
    </>
  );
}

export default CrudListTable;
