import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Badge, Alert } from 'react-bootstrap';
import { productsApi } from '../../../services/api';
import { useAddAppWizard } from './AddAppWizardContext';

function ProductStep() {
  const { selectedApp, selectedProduct, selectProduct } = useAddAppWizard();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const appProducts = selectedApp?.memberOfProducts || [];

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    productsApi.search(searchTerm)
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [searchTerm]);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Select a product for this application</Form.Label>
        <Form.Control
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by name..."
        />
      </Form.Group>

      <ListGroup style={{ maxHeight: '300px', overflow: 'auto' }}>
        {renderProductResults(searchTerm, results, loading, appProducts, selectProduct)}
      </ListGroup>

      {selectedProduct && (
        <Alert variant="info" className="mt-3">
          <strong>Selected:</strong> {selectedProduct.name}
        </Alert>
      )}
    </>
  );
}

function renderProductResults(searchTerm, results, loading, appProducts, onSelect) {
  if (searchTerm.length < 2) {
    return (
      <ListGroup.Item className="text-center text-muted">
        Type at least 2 characters to search products
      </ListGroup.Item>
    );
  }

  if (loading) {
    return (
      <ListGroup.Item className="text-center text-muted">
        Searching products...
      </ListGroup.Item>
    );
  }

  if (results.length === 0) {
    return (
      <ListGroup.Item className="text-center text-muted">
        No products found
      </ListGroup.Item>
    );
  }

  return results.map(product => (
    <ProductResultItem
      key={product.id}
      product={product}
      appProducts={appProducts}
      onSelect={onSelect}
    />
  ));
}

function ProductResultItem({ product, appProducts, onSelect }) {
  const isInThisProduct = appProducts.some(p => p.id === product.id);
  const otherProducts = appProducts.filter(p => p.id !== product.id);

  return (
    <ListGroup.Item
      action={!isInThisProduct}
      onClick={() => !isInThisProduct && onSelect(product)}
      className={`p-3 ${isInThisProduct ? 'bg-light' : ''}`}
      style={{ cursor: isInThisProduct ? 'not-allowed' : 'pointer' }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <strong>{product.name}</strong>
          {isInThisProduct && (
            <Badge bg="secondary" className="ms-2">App already in this product</Badge>
          )}
          <div className="text-muted small">{product.id}</div>
          {product.transactionCycle && (
            <div className="text-muted small">{product.transactionCycle} ({product.transactionCycleId})</div>
          )}
          {!isInThisProduct && otherProducts.length > 0 && (
            <div className="small mt-1">
              <Badge bg="warning" text="dark">Note</Badge>
              <span className="text-muted ms-2">
                This app is already in: {otherProducts.map(p => p.name).join(', ')}
              </span>
            </div>
          )}
        </div>
        <div className="text-end">
          {product.stackId && (
            <Badge bg="info">{product.stackId}</Badge>
          )}
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default ProductStep;
