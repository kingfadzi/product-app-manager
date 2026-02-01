import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

function ProductDetailBreadcrumb({ history, product }) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
      {product.stackId && (
        <Breadcrumb.Item onClick={() => history.push(`/products?stack=${product.stackId}`)}>
          {product.stackId}
        </Breadcrumb.Item>
      )}
      <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default ProductDetailBreadcrumb;
