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
import { useAppOnboarding } from '../hooks/useAppOnboarding';
import AppListFilters from '../components/apps/AppListFilters';
import AppsTable from '../components/apps/AppsTable';
import AddAppModal from '../components/products/AddAppModal';

function AppList() {
  const history = useHistory();
  const location = useLocation();
  const { apps, loading, error } = useContext(AppContext);
  const { isMyApp, isLoggedIn } = useUser();

  // Check if this is a global search (from header)
  const params = new URLSearchParams(location.search);
  const isGlobalSearch = params.has('search');

  // Determine view mode
  // Guest: always sees all apps
  // Logged in: sees "My Apps" unless searching
  const showAllApps = !isLoggedIn || isGlobalSearch;

  // Filter apps based on view mode
  const baseApps = useMemo(() => {
    if (showAllApps) {
      return apps;
    }
    return apps.filter(isMyApp);
  }, [apps, showAllApps, isMyApp]);

  const [showAddWizard, setShowAddWizard] = useState(false);

  // App onboarding
  const { onboardApp } = useAppOnboarding();

  // Pagination
  const {
    resetPage
  } = usePagination([], 10);

  // Filters
  const {
    searchTerm,
    resCatFilter,
    stackFilter,
    productFilter,
    tcFilter,
    tierFilter,
    stacks,
    productOptions,
    tcOptions,
    tierOptions,
    filteredApps,
    hasActiveFilters,
    updateFilter,
  } = useAppListFilters(baseApps, resetPage);

  // Update pagination when filtered apps change
  const paginationResult = usePagination(filteredApps, 10);

  // Page title and count
  const getPageTitle = () => {
    if (isGlobalSearch) return 'Search Results';
    if (!isLoggedIn) return 'Applications';
    return 'My Applications';
  };
  const pageTitle = getPageTitle();
  const myAppCount = apps.filter(isMyApp).length;

  // Show TC filter for guest or search results (not for "My Applications")
  const showTcFilter = !isLoggedIn || isGlobalSearch;

  // Handle addApp query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('addApp') === 'true') {
      setShowAddWizard(true);
      params.delete('addApp');
      history.replace(`/apps?${params.toString()}`);
    }
  }, [location.search, history]);

  // Wizard handles closing via result step - errors propagate to wizard for display
  const handleAddApp = (selectedApps, metadata) => onboardApp(selectedApps, metadata);

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
        {isGlobalSearch && isLoggedIn && (
          <Breadcrumb.Item onClick={() => history.push('/apps')}>My Applications</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>{pageTitle}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          {pageTitle}
          {isLoggedIn && !isGlobalSearch && (
            <span className="text-muted ml-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>({myAppCount})</span>
          )}
          {isGlobalSearch && searchTerm && (
            <span className="text-muted ml-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>for "{searchTerm}"</span>
          )}
        </h1>
        {isLoggedIn && !isGlobalSearch && (
          <Button variant="dark" onClick={() => setShowAddWizard(true)}>+ Add Application</Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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
