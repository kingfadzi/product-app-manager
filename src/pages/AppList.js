import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Spinner, Alert, Breadcrumb, Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';
import TablePagination from '../components/common/TablePagination';
import { usePagination } from '../hooks/usePagination';
import useAppListFilters from '../hooks/useAppListFilters';
import AppListFilters from '../components/apps/AppListFilters';
import AppsTable from '../components/apps/AppsTable';
import AddAppModal from '../components/products/AddAppModal';

function AppList() {
  const history = useHistory();
  const location = useLocation();
  const { apps, loading, error } = useContext(AppContext);
  const { currentUser, isMyApp } = useUser();

  // Check if this is a global search (from header) or My Applications view
  const params = new URLSearchParams(location.search);
  const isGlobalSearch = params.has('search');

  // Filter apps based on view mode
  const baseApps = useMemo(() => {
    if (isGlobalSearch) {
      return apps; // Global search: all apps
    }
    return apps.filter(isMyApp); // My Applications: only user's apps
  }, [apps, isGlobalSearch, isMyApp]);

  const [showAddWizard, setShowAddWizard] = useState(false);

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedApps,
    startIndex,
    endIndex,
    totalItems,
    showPagination,
    resetPage
  } = usePagination([], 10);

  // Filters
  const {
    searchTerm,
    setSearchTerm,
    resCatFilter,
    stackFilter,
    productFilter,
    tcFilter,
    stacks,
    productOptions,
    tcOptions,
    filteredApps,
    hasActiveFilters,
    updateFilter,
  } = useAppListFilters(baseApps, resetPage);

  // Page title based on view mode
  const pageTitle = isGlobalSearch ? 'Search Results' : 'My Applications';
  const myAppCount = apps.filter(isMyApp).length;

  // Update pagination when filtered apps change
  const paginationResult = usePagination(filteredApps, 10);

  // Handle addApp query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('addApp') === 'true') {
      setShowAddWizard(true);
      params.delete('addApp');
      history.replace(`/apps?${params.toString()}`);
    }
  }, [location.search, history]);

  const handleAddApp = (selectedApps) => {
    if (selectedApps?.length > 0) {
      history.push(`/apps/${selectedApps[0].id}`);
    }
    setShowAddWizard(false);
  };

  const handleRowClick = (appId) => history.push(`/apps/${appId}`);

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        {isGlobalSearch && (
          <Breadcrumb.Item onClick={() => history.push('/apps')}>My Applications</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          {pageTitle}
          {!isGlobalSearch && <span className="text-muted ml-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>({myAppCount})</span>}
          {isGlobalSearch && searchTerm && <span className="text-muted ml-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>for "{searchTerm}"</span>}
        </h1>
        {!isGlobalSearch && (
          <Button variant="dark" onClick={() => setShowAddWizard(true)}>+ Add Application</Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <AppListFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        stackFilter={stackFilter}
        productFilter={productFilter}
        tcFilter={tcFilter}
        resCatFilter={resCatFilter}
        stacks={stacks}
        productOptions={productOptions}
        tcOptions={tcOptions}
        updateFilter={updateFilter}
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
            onRowClick={handleRowClick}
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

      <AddAppModal
        show={showAddWizard}
        onHide={() => setShowAddWizard(false)}
        onAdd={handleAddApp}
        existingAppIds={apps.map(a => a.id)}
      />
    </PageLayout>
  );
}

export default AppList;
