import React from 'react';
import EmptyState from '../common/EmptyState';
import TablePagination from '../common/TablePagination';
import AppListFilters from './AppListFilters';
import AppsTable from './AppsTable';

function AppListContent({
  stackFilter,
  productFilter,
  tcFilter,
  tierFilter,
  resCatFilter,
  stacks,
  productOptions,
  tcOptions,
  tierOptions,
  updateFilter,
  showTcFilter,
  filteredApps,
  hasActiveFilters,
  paginationResult,
  onRowClick,
}) {
  return (
    <>
      <AppListFilters
        stackFilter={stackFilter}
        productFilter={productFilter}
        tcFilter={tcFilter}
        tierFilter={tierFilter}
        resCatFilter={resCatFilter}
        stacks={stacks}
        productOptions={productOptions}
        tcOptions={tcOptions}
        tierOptions={tierOptions}
        updateFilter={updateFilter}
        showTcFilter={showTcFilter}
      />

      {filteredApps.length === 0 ? (
        <EmptyState
          title="No apps found"
          description={hasActiveFilters ? "Try adjusting your filters." : "No apps are currently available."}
        />
      ) : (
        <>
          <AppsTable
            apps={paginationResult.paginatedData}
            onRowClick={onRowClick}
            onFilterClick={updateFilter}
          />
          {paginationResult.showPagination && (
            <TablePagination
              currentPage={paginationResult.currentPage}
              totalPages={paginationResult.totalPages}
              onPageChange={paginationResult.setCurrentPage}
              startIndex={paginationResult.startIndex}
              endIndex={paginationResult.endIndex}
              totalItems={paginationResult.totalItems}
              itemLabel="apps"
            />
          )}
        </>
      )}
    </>
  );
}

export default AppListContent;
