import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { APP_NAME } from '../../constants/config';
import { useUser } from '../../context/UserContext';

function Header() {
  const location = useLocation();
  const history = useHistory();
  const { currentUser, demoUsers, switchUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/apps?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

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

          <Form inline onSubmit={handleSearchSubmit} className="mx-3" style={{ flex: 1, maxWidth: '400px' }}>
            <FormControl
              type="text"
              placeholder="Search all apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              style={{ width: '100%', backgroundColor: '#495057', border: 'none', color: '#fff' }}
              className="search-input"
            />
          </Form>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="user-dropdown"
              className="d-flex align-items-center text-light text-decoration-none p-0"
              style={{ fontSize: '13px' }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                backgroundColor: currentUser.isAdmin ? '#0d6efd' : '#6c757d',
                borderRadius: '50%',
                marginRight: '8px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                {currentUser.initials}
              </span>
              {currentUser.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Switch User (Demo)</Dropdown.Header>
              {demoUsers.map(user => (
                <Dropdown.Item
                  key={user.id}
                  active={user.id === currentUser.id}
                  onClick={() => switchUser(user.id)}
                >
                  {user.name}
                  {user.isAdmin && <span className="text-muted ml-2">(All Apps)</span>}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
      <style>{`
        .search-input::placeholder {
          color: #adb5bd;
        }
        #user-dropdown::after {
          margin-left: 0.5rem;
        }
      `}</style>
    </Navbar>
  );
}

export default Header;
