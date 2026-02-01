import React from 'react';
import { Table } from 'react-bootstrap';

function ProductsTab({ products = [], history }) {
  const items = Array.isArray(products) ? products : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">Not assigned to any products</p>;
  }

  return (
    <Table size="sm" hover className="mb-0">
      <thead>
        <tr>
          <th>Product</th>
          <th>Stack</th>
        </tr>
      </thead>
      <tbody>
        {items.map(product => (
          <tr
            key={product.id}
            onClick={() => history.push(`/products/${product.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <td>{product.name}</td>
            <td className="text-muted">{product.stack || '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ProductsTab;
