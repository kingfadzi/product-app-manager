import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'house' },
    { path: '/products', label: 'Products', icon: 'box' },
    { path: '/products/new', label: 'New Product', icon: 'plus-circle' },
    { path: '/apps', label: 'All Apps', icon: 'grid' },
  ];

  return (
    <div className="sidebar bg-light border-right" style={{
      width: '200px',
      minHeight: 'calc(100vh - 56px)',
      paddingTop: '1rem',
      position: 'fixed',
      top: '56px',
      left: 0,
    }}>
      <Nav className="flex-column">
        {navItems.map(item => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`text-dark ${location.pathname === item.path ? 'bg-primary text-white' : ''}`}
            style={{ borderRadius: '0' }}
          >
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}

export default Sidebar;
