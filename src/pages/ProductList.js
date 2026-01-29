import React from 'react';
import { Table, Button, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';
import TablePagination from '../components/common/TablePagination';
import { usePagination } from '../hooks/usePagination';

function ProductList() {
  const history = useHistory();
  const location = useLocation();
  const { products, productApps, loading, error } = useProducts();

  // Get stack filter from URL
  const params = new URLSearchParams(location.search);
  const stackFilter = params.get('stack');

  const filteredProducts = stackFilter
    ? products.filter(p => p.stack === stackFilter)
    : products;

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedProducts,
    startIndex,
    endIndex,
    totalItems,
    showPagination
  } = usePagination(filteredProducts, 10);

  const getAppCount = (productId) => {
    return productApps.filter(pa => pa.productId === productId).length;
  };

  if (loading && products.length === 0) {
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
        <Breadcrumb.Item active>Products{stackFilter ? ` - ${stackFilter}` : ''}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Products</h1>
        <Button onClick={() => history.push('/products/new')}>
          New Product
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product to get started."
          actionLabel="Create Product"
          onAction={() => history.push('/products/new')}
        />
      ) : (
        <>
          <Table striped bordered hover style={{ whiteSpace: 'nowrap' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Apps</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(product => (
                <tr
                  key={product.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push(`/products/${product.id}`)}
                >
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{getAppCount(product.id)}</td>
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
              itemLabel="products"
            />
          )}
        </>
      )}
    </PageLayout>
  );
}

export default ProductList;
