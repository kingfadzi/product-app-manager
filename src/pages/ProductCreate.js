import React, { useState } from 'react';
import { Alert, Breadcrumb } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import PageLayout from '../components/layout/PageLayout';
import AddAppModal from '../components/products/AddAppModal';
import ProductCreateForm from '../components/products/productCreate/ProductCreateForm';

function ProductCreate() {
  const history = useHistory();
  const { createProduct, addAppToProduct } = useProducts();
  const [error, setError] = useState(null);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [addedApps, setAddedApps] = useState([]); // Apps with their metadata

  const handleAddApp = (selectedApps, metadata) => {
    const appWithMetadata = {
      ...selectedApps[0],
      metadata
    };
    setAddedApps([...addedApps, appWithMetadata]);
    setShowAddAppModal(false);
  };

  const handleRemoveApp = (appId) => {
    setAddedApps(addedApps.filter(a => a.id !== appId));
  };

  const handleSubmit = async (values) => {
    try {
      setError(null);
      const product = await createProduct({
        name: values.name,
        stack: values.stack,
        description: values.description,
      });

      // Add apps in parallel
      await Promise.all(
        addedApps.map(app => addAppToProduct(product.id, app.id, app.metadata))
      );

      history.push(`/products/${product.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const existingAppIds = addedApps.map(a => a.id);

  return (
    <PageLayout>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/products')}>Products</Breadcrumb.Item>
        <Breadcrumb.Item active>New Product</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">Create New Product</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <ProductCreateForm
        addedApps={addedApps}
        onOpenModal={() => setShowAddAppModal(true)}
        onRemoveApp={handleRemoveApp}
        onCancel={() => history.push('/products')}
        onSubmit={handleSubmit}
      />

      <AddAppModal
        show={showAddAppModal}
        onHide={() => setShowAddAppModal(false)}
        onAdd={handleAddApp}
        existingAppIds={existingAppIds}
      />
    </PageLayout>
  );
}

export default ProductCreate;
