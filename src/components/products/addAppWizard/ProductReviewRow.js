import React from 'react';

function ProductReviewRow({ product }) {
  return (
    <tr>
      <th className="bg-light">Product</th>
      <td>
        <strong>{product?.name}</strong>
        {product?.id && <span className="text-muted ms-2">({product.id})</span>}
        {product?.stackId && <span className="text-muted ms-2">- {product.stackId}</span>}
      </td>
    </tr>
  );
}

export default ProductReviewRow;
