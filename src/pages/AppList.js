import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Spinner, Alert, Breadcrumb, Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import PageLayout from '../components/layout/PageLayout';
import { usePagination } from '../hooks/usePagination';
import useAppListFilters from '../hooks/useAppListFilters';
import { useAppOnboarding } from '../hooks/useAppOnboarding';
import AppListContent from '../components/apps/AppListContent';
import AddAppModal from '../components/products/AddAppModal';

function AppList() {
  const history = useHistory();
  const location = useLocation();
  const { apps, loading, error } = useContext(AppContext);
  const { isMyApp, isLoggedIn } = useUser();

  const params = new URLSearchParams(location.search);
  const isGlobalSearch = params.has('search');

  const showAllApps = !isLoggedIn || isGlobalSearch;

  const baseApps = useMemo(() => {
    if (showAllApps) {
      return apps;
    }
    return apps.filter(isMyApp);
  }, [apps, showAllApps, isMyApp]);

  const [showAddWizard, setShowAddWizard] = useState(false);

  const { onboardApp } = useAppOnboarding();

  const {
    resetPage
  } = usePagination([], 10);

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

  const paginationResult = usePagination(filteredApps, 10);

  const getPageTitle = () => {
    if (isGlobalSearch) return 'Search Results';
    if (!isLoggedIn) return 'Applications';
    return 'My Applications';
  };
  const pageTitle = getPageTitle();
  const myAppCount = apps.filter(isMyApp).length;

  const showTcFilter = !isLoggedIn || isGlobalSearch;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('addApp') === 'true') {
      setShowAddWizard(true);
      params.delete('addApp');
      history.replace(`/apps?${params.toString()}`);
    }
  }, [location.search, history]);

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

      <AppListContent
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
        filteredApps={filteredApps}
        hasActiveFilters={hasActiveFilters}
        paginationResult={paginationResult}
        onRowClick={handleRowClick}
      />

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
