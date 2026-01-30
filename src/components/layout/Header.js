import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../constants/config';

// Mock user - replace with actual auth context when available
const currentUser = {
  name: 'John Smith',
  initials: 'JS'
};

function Header() {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="py-1">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            backgroundColor: '#0d6efd',
            borderRadius: '4px',
            marginRight: '10px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            LC
          </span>
          {APP_NAME}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="mr-auto">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/apps"
              active={location.pathname.startsWith('/apps')}
            >
              My Applications
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto d-flex align-items-center">
            <span className="text-light d-flex align-items-center" style={{ fontSize: '13px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                backgroundColor: '#6c757d',
                borderRadius: '50%',
                marginRight: '8px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                {currentUser.initials}
              </span>
              {currentUser.name}
            </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
