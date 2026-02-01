import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

function AppBreadcrumb({ history, app, appProducts }) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
      {appProducts.length > 0 ? (
        <Breadcrumb.Item onClick={() => history.push(`/products/${appProducts[0].id}`)}>
          {appProducts[0].name}
        </Breadcrumb.Item>
      ) : (
        <Breadcrumb.Item onClick={() => history.push('/apps')}>Applications</Breadcrumb.Item>
      )}
      <Breadcrumb.Item active>{app.name}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
