import React, { useState, useContext } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import useProducts from '../hooks/useProducts';
import { useAppOnboarding } from '../hooks/useAppOnboarding';
import PageLayout from '../components/layout/PageLayout';
import AddAppModal from '../components/products/AddAppModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { usePagination } from '../hooks/usePagination';
import ProductAppsTable from '../components/products/productDetail/ProductAppsTable';
import ProductDetailBreadcrumb from '../components/products/productDetail/ProductDetailBreadcrumb';
import ProductHeader from '../components/products/productDetail/ProductHeader';

function ProductDetail() {
  const { id } = useParams();
  const history = useHistory();
  const { apps } = useContext(AppContext);
  const { isLoggedIn } = useUser();
  const {
    getProductById,
    getAppsForProduct,
    setProductApps,
    removeAppFromProduct,
    error
  } = useProducts();

  const [showAddModal, setShowAddModal] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const { onboardApp } = useAppOnboarding();
  const handleAddApps = async (selectedApps, metadata) => {
    const result = await onboardApp(selectedApps, metadata);
    const association = result?.association || result;
    if (association) {
      setProductApps(prev => [...prev, association]);
    }
    return result;
  };

  const product = getProductById(id);
  const productAppIds = getAppsForProduct(id);
  const productApps = apps.filter(app => productAppIds.includes(app.id));

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedApps,
    startIndex,
    endIndex,
    totalItems,
    showPagination
  } = usePagination(productApps, 10);

  const handleRemoveApp = async () => {
    if (removeConfirm) {
      await removeAppFromProduct(id, removeConfirm.id);
      setRemoveConfirm(null);
    }
  };

  if (!product) {
    return (
      <PageLayout>
        <Alert variant="warning">
          Product not found.{' '}
          <Button variant="link" onClick={() => history.push('/products')}>
            Back to Products
          </Button>
        </Alert>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ProductDetailBreadcrumb history={history} product={product} />

      {error && <Alert variant="danger">{error}</Alert>}

      <ProductHeader
        product={product}
        isLoggedIn={isLoggedIn}
        onAddApp={() => setShowAddModal(true)}
      />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Applications</h5>
      </div>

      {productApps.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <p className="text-muted mb-3">No applications added to this product yet</p>
            {isLoggedIn && (
              <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                Add Application
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <ProductAppsTable
          apps={productApps}
          onRowClick={(app) => history.push(`/apps/${app.id}`)}
          pagination={{
            currentPage,
            totalPages,
            paginatedData: paginatedApps,
            startIndex,
            endIndex,
            totalItems,
            showPagination,
            onPageChange: setCurrentPage,
          }}
        />
      )}

      <AddAppModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAddApps}
        existingAppIds={productAppIds}
      />

      <ConfirmModal
        show={!!removeConfirm}
        onHide={() => setRemoveConfirm(null)}
        onConfirm={handleRemoveApp}
        title="Remove App"
        message={`Are you sure you want to remove "${removeConfirm?.name}" from this product?`}
        confirmText="Remove"
      />
    </PageLayout>
  );
}

export default ProductDetail;
