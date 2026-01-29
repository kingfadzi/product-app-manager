import React, { useContext, useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';
import TablePagination from '../components/common/TablePagination';
import { usePagination } from '../hooks/usePagination';
import { linesOfBusinessApi } from '../services/api';

function Dashboard() {
  const { products, apps, productApps, loading, error } = useContext(AppContext);
  const history = useHistory();
  const [tcList, setTcList] = useState([]);

  useEffect(() => {
    linesOfBusinessApi.getAll().then(setTcList).catch(console.error);
  }, []);

  const getTcName = (tcId) => {
    const tc = tcList.find(t => t.id === tcId);
    return tc ? tc.name : '-';
  };

  // Group products by stack and calculate metrics
  const stackGroups = products.reduce((acc, product) => {
    const stack = product.stack || 'Unassigned';
    if (!acc[stack]) {
      acc[stack] = { products: [], tc: product.tc || '-' };
    }
    acc[stack].products.push(product);
    // Use TC from first product that has one
    if (product.tc && acc[stack].tc === '-') {
      acc[stack].tc = product.tc;
    }
    return acc;
  }, {});

  const stacks = Object.keys(stackGroups).map(stackName => {
    const stackData = stackGroups[stackName];
    const stackProductIds = stackData.products.map(p => p.id);

    // Get all app IDs associated with products in this stack
    const stackAppIds = productApps
      .filter(pa => stackProductIds.includes(pa.productId))
      .map(pa => pa.appId);

    // Get unique apps in this stack
    const stackApps = apps.filter(app => stackAppIds.includes(app.id));

    // Calculate metrics
    const criticalApps = stackApps.filter(app => app.resCat === 'Critical').length;
    const openRisks = stackApps.reduce((sum, app) => sum + (app.openRisks || 0), 0);

    return {
      name: stackName,
      productCount: stackData.products.length,
      appCount: stackApps.length,
      criticalApps,
      openRisks,
      tc: stackData.tc
    };
  });

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedStacks,
    startIndex,
    endIndex,
    totalItems,
    showPagination
  } = usePagination(stacks, 10);

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Alert variant="danger">Error loading data: {error}</Alert>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Stacks</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Stacks</h1>
        <Button size="sm" onClick={() => history.push('/products/new')}>
          New Stack
        </Button>
      </div>

      {stacks.length === 0 ? (
        <EmptyState
          title="No stacks yet"
          description="Create your first product to get started."
          actionLabel="Create Product"
          onAction={() => history.push('/products/new')}
        />
      ) : (
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
              {paginatedStacks.map(stack => (
                  <tr
                    key={stack.name}
                    style={{
                      cursor: 'pointer',
                      background: stack.openRisks > 5 ? '#fff3cd' : undefined
                    }}
                    onClick={() => history.push(`/products?stack=${encodeURIComponent(stack.name)}`)}
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
              onPageChange={setCurrentPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              itemLabel="stacks"
            />
          )}
        </>
      )}
    </PageLayout>
  );
}

export default Dashboard;
