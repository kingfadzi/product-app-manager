import React from 'react';
import { Container } from 'react-bootstrap';

function PageLayout({ children, fluid = true }) {
  return (
    <Container fluid={fluid} className="py-4">
      {children}
    </Container>
  );
}

export default PageLayout;
