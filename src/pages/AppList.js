import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Table, Row, Col, Form, Spinner, Alert, Breadcrumb, Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';
import TablePagination from '../components/common/TablePagination';
import { usePagination } from '../hooks/usePagination';
import AddAppModal from '../components/products/AddAppModal';

function AppList() {
  const history = useHistory();
  const location = useLocation();
  const { apps, loading, error } = useContext(AppContext);

  // Parse URL query params for initial filter values
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialResCat = queryParams.get('resCat') || '';
  const initialStack = queryParams.get('stack') || '';
  const initialProduct = queryParams.get('product') || '';
  const initialTc = queryParams.get('tc') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [resCatFilter, setResCatFilter] = useState(initialResCat);
  const [stackFilter, setStackFilter] = useState(initialStack);
  const [productFilter, setProductFilter] = useState(initialProduct);
  const [tcFilter, setTcFilter] = useState(initialTc);

  // Get unique stacks from apps
  const stacks = useMemo(() => {
    const uniqueStacks = [...new Set(apps.map(app => app.stack).filter(Boolean))];
    return uniqueStacks.sort();
  }, [apps]);

  // Get unique products from apps
  const productOptions = useMemo(() => {
    const uniqueProducts = apps
      .filter(app => app.productId && app.productName)
      .reduce((acc, app) => {
        if (!acc.find(p => p.id === app.productId)) {
          acc.push({ id: app.productId, name: app.productName });
        }
        return acc;
      }, []);
    return uniqueProducts.sort((a, b) => a.name.localeCompare(b.name));
  }, [apps]);

  // Get unique TCs from apps
  const tcOptions = useMemo(() => {
    const uniqueTcs = apps
      .filter(app => app.tc && app.tcName)
      .reduce((acc, app) => {
        if (!acc.find(t => t.id === app.tc)) {
          acc.push({ id: app.tc, name: app.tcName });
        }
        return acc;
      }, []);
    return uniqueTcs.sort((a, b) => a.name.localeCompare(b.name));
  }, [apps]);

  // Filtered apps based on search and filters
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = !searchTerm ||
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.cmdbId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesResCat = !resCatFilter || app.resCat === resCatFilter;
      const matchesStack = !stackFilter || app.stack === stackFilter;
      const matchesProduct = !productFilter || app.productId === productFilter;
      const matchesTc = !tcFilter || app.tc === tcFilter;

      return matchesSearch && matchesResCat && matchesStack && matchesProduct && matchesTc;
    });
  }, [apps, searchTerm, resCatFilter, stackFilter, productFilter, tcFilter]);

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
  } = usePagination(filteredApps, 10);

  // Add Application wizard state
  const [showAddWizard, setShowAddWizard] = useState(false);

  // Consolidated effect: Update filters from URL and handle addApp param
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Update filter states from URL
    setSearchTerm(params.get('search') || '');
    setResCatFilter(params.get('resCat') || '');
    setStackFilter(params.get('stack') || '');
    setProductFilter(params.get('product') || '');
    setTcFilter(params.get('tc') || '');
    resetPage();

    // Check for addApp query param to auto-open wizard
    if (params.get('addApp') === 'true') {
      setShowAddWizard(true);
      // Remove the param from URL
      params.delete('addApp');
      history.replace(`/apps?${params.toString()}`);
    }
  }, [location.search, resetPage, history]);

  const handleAddApp = (selectedApps, metadata) => {
    // After app is added, navigate to the app detail page
    if (selectedApps && selectedApps.length > 0) {
      history.push(`/apps/${selectedApps[0].id}`);
    }
    setShowAddWizard(false);
  };

  // Helper to update URL with new filter
  const updateFilter = (filterName, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    history.push(`/apps?${params.toString()}`);
  };

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
        <Breadcrumb.Item active>Applications</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Applications</h1>
        <Button variant="dark" onClick={() => setShowAddWizard(true)}>+ Add Application</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3 g-2">
        <Col xs={12} sm={6} lg={3}>
          <Form.Control
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs={6} sm={3} lg={2}>
          <Form.Control
            as="select"
            value={stackFilter}
            onChange={(e) => {
              setStackFilter(e.target.value);
              updateFilter('stack', e.target.value);
            }}
          >
            <option value="">All Stacks</option>
            {stacks.map(stack => (
              <option key={stack} value={stack}>{stack}</option>
            ))}
          </Form.Control>
        </Col>
        <Col xs={6} sm={3} lg={2}>
          <Form.Control
            as="select"
            value={productFilter}
            onChange={(e) => {
              setProductFilter(e.target.value);
              updateFilter('product', e.target.value);
            }}
          >
            <option value="">All Products</option>
            {productOptions.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </Form.Control>
        </Col>
        <Col xs={6} sm={3} lg={2}>
          <Form.Control
            as="select"
            value={tcFilter}
            onChange={(e) => {
              setTcFilter(e.target.value);
              updateFilter('tc', e.target.value);
            }}
          >
            <option value="">All TCs</option>
            {tcOptions.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.name}</option>
            ))}
          </Form.Control>
        </Col>
        <Col xs={6} sm={3} lg={2}>
          <Form.Control
            as="select"
            value={resCatFilter}
            onChange={(e) => {
              setResCatFilter(e.target.value);
              updateFilter('resCat', e.target.value);
            }}
          >
            <option value="">All ResCat</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Form.Control>
        </Col>
      </Row>

      {filteredApps.length === 0 ? (
        <EmptyState
          title="No apps found"
          description={searchTerm || resCatFilter || stackFilter || productFilter || tcFilter
            ? "Try adjusting your filters."
            : "No apps are currently available."
          }
        />
      ) : (
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
              {paginatedApps.map(app => (
                <tr
                  key={app.id}
                  style={{ cursor: 'pointer' }}
                >
                  <td onClick={() => history.push(`/apps/${app.id}`)}>{app.cmdbId}</td>
                  <td onClick={() => history.push(`/apps/${app.id}`)} style={{ fontWeight: 500 }}>{app.name}</td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      if (app.stack) updateFilter('stack', app.stack);
                    }}
                    style={{ color: app.stack ? '#0d6efd' : undefined, cursor: app.stack ? 'pointer' : 'default' }}
                  >
                    {app.stack || '-'}
                  </td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      if (app.productId) updateFilter('product', app.productId);
                    }}
                    style={{ color: app.productId ? '#0d6efd' : undefined, cursor: app.productId ? 'pointer' : 'default' }}
                  >
                    {app.productName || '-'}
                  </td>
                  <td onClick={() => history.push(`/apps/${app.id}`)}>{app.resCat || '-'}</td>
                  <td className="text-center" onClick={() => history.push(`/apps/${app.id}`)}>{app.repoCount || 0}</td>
                  <td className="text-center" onClick={() => history.push(`/apps/${app.id}`)}>{app.backlogCount || 0}</td>
                  <td className="text-center" onClick={() => history.push(`/apps/${app.id}`)}>{app.openRisks || 0}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          itemLabel="apps"
        />
      )}

      {/* Add Application Wizard Modal */}
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
