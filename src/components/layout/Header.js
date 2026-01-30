import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { APP_NAME } from '../../constants/config';
import { useUser } from '../../context/UserContext';

function Header() {
  const location = useLocation();
  const history = useHistory();
  const { currentUser, demoUsers, switchUser, isLoggedIn } = useUser();
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
              {isLoggedIn ? 'My Applications' : 'Applications'}
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

          <Dropdown align="end" className="mr-2">
            <Dropdown.Toggle
              variant="link"
              id="user-dropdown"
              className="d-flex align-items-center text-light text-decoration-none p-0"
              style={{ fontSize: '13px' }}
            >
              {isLoggedIn ? (
                <>
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
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ right: 0, left: 'auto' }}>
              <Dropdown.Header>Switch User (Demo)</Dropdown.Header>
              {demoUsers.map(user => (
                <Dropdown.Item
                  key={user.id}
                  active={user.id === currentUser.id}
                  onClick={() => switchUser(user.id)}
                >
                  {user.isGuest ? 'Guest (Not Signed In)' : user.name}
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
