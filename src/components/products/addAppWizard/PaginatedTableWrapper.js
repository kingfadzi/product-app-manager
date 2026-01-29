import React from 'react';
import TablePagination from '../../common/TablePagination';
import { usePagination } from '../../../hooks/usePagination';

function PaginatedTableWrapper({ data, itemsPerPage = 5, renderTable, itemLabel = 'items' }) {
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    totalItems,
    showPagination
  } = usePagination(data, itemsPerPage);

  return (
    <>
      {renderTable(paginatedData)}
      {showPagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          size="sm"
          showInfo={false}
          itemLabel={itemLabel}
        />
      )}
    </>
  );
}

export default PaginatedTableWrapper;
