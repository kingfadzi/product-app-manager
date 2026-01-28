import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function AppCard({ app, onRemove, showRemove = true }) {
  const history = useHistory();

  const tierColors = {
    gold: 'warning',
    silver: 'secondary',
    bronze: 'info',
  };

  const statusColors = {
    active: 'success',
    maintenance: 'warning',
    deprecated: 'danger',
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{app.name}</span>
          <Badge variant={tierColors[app.tier] || 'secondary'}>
            {app.tier}
          </Badge>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {app.cmdbId}
        </Card.Subtitle>
        <Card.Text>
          {app.description}
        </Card.Text>
        <Badge variant={statusColors[app.status] || 'secondary'}>
          {app.status}
        </Badge>
      </Card.Body>
      <Card.Footer className="bg-white">
        <Button
          variant="primary"
          size="sm"
          onClick={() => history.push(`/apps/${app.id}`)}
        >
          View
        </Button>
        {showRemove && onRemove && (
          <Button
            variant="outline-danger"
            size="sm"
            className="ml-2"
            onClick={() => onRemove(app)}
          >
            Remove
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
}

export default AppCard;
