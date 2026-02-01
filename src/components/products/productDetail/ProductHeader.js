import React from 'react';
import { Button } from 'react-bootstrap';

function ProductHeader({ product, isLoggedIn, onAddApp }) {
  const initial = product.name.charAt(0).toUpperCase();
  return (
    <div className="d-flex align-items-center mb-4">
      <div
        className="d-flex align-items-center justify-content-center mr-3"
        style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#6c5ce7',
          borderRadius: '8px',
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        {initial}
      </div>
      <div className="flex-grow-1">
        <h2 className="mb-1">{product.name}</h2>
        <span className="text-muted">{product.description || 'No description'}</span>
      </div>
      {isLoggedIn && (
        <Button variant="outline-primary" size="sm" onClick={onAddApp}>
          Add Application
        </Button>
      )}
    </div>
  );
}

export default ProductHeader;
