import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function ProductCard({ product, appCount = 0, onDelete }) {
  const history = useHistory();

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{product.name}</span>
          <Badge variant="info">{appCount} apps</Badge>
        </Card.Title>
        <Card.Text className="text-muted">
          {product.description}
        </Card.Text>
        <Card.Text>
          <small className="text-muted">
            Created: {product.createdAt}
          </small>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white">
        <Button
          variant="primary"
          size="sm"
          onClick={() => history.push(`/products/${product.id}`)}
        >
          View
        </Button>
        {onDelete && (
          <Button
            variant="outline-danger"
            size="sm"
            className="ml-2"
            onClick={() => onDelete(product)}
          >
            Delete
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;
