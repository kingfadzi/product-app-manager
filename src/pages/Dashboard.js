import React, { useContext } from 'react';
import { Table, Button, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';

function Dashboard() {
  const { products, loading, error } = useContext(AppContext);
  const history = useHistory();

  // Group products by stack
  const stackGroups = products.reduce((acc, product) => {
    const stack = product.stack || 'unassigned';
    if (!acc[stack]) {
      acc[stack] = [];
    }
    acc[stack].push(product);
    return acc;
  }, {});

  const stacks = Object.keys(stackGroups).map(stack => ({
    name: stack,
    productCount: stackGroups[stack].length,
  }));

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
          New Product
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
        <Table striped bordered hover size="sm" style={{ whiteSpace: 'nowrap' }}>
          <thead>
            <tr>
              <th>Stack</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {stacks.map(stack => (
              <tr
                key={stack.name}
                style={{ cursor: 'pointer' }}
                onClick={() => history.push(`/products?stack=${stack.name}`)}
              >
                <td style={{ fontWeight: 500 }}>{stack.name}</td>
                <td>{stack.productCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageLayout>
  );
}

export default Dashboard;
