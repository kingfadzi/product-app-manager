import React, { useContext, useState } from 'react';
import { Card, Row, Col, Form, InputGroup, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';

function HomePage() {
  const history = useHistory();
  const { apps, products, loading, error } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Calculate metrics
  const metrics = {
    totalApps: apps.length,
    totalProducts: products.length,
    criticalApps: apps.filter(a => a.resCat === 'Critical').length,
    highApps: apps.filter(a => a.resCat === 'High').length,
    mediumApps: apps.filter(a => a.resCat === 'Medium').length,
    lowApps: apps.filter(a => a.resCat === 'Low').length,
    openRisks: apps.reduce((sum, a) => sum + (a.openRisks || 0), 0),
    totalRepos: apps.reduce((sum, a) => sum + (a.repoCount || 0), 0),
    totalBacklogs: apps.reduce((sum, a) => sum + (a.backlogCount || 0), 0),
  };

  // Get unique stacks from products
  const stacks = [...new Set(products.map(p => p.stack).filter(Boolean))];

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = apps.filter(app =>
      app.name.toLowerCase().includes(lowerQuery) ||
      app.cmdbId.toLowerCase().includes(lowerQuery) ||
      (app.description && app.description.toLowerCase().includes(lowerQuery))
    ).slice(0, 8);

    setSearchResults(results);
    setShowResults(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.length >= 2) {
      history.push(`/apps?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navigateToApp = (appId) => {
    setShowResults(false);
    setSearchQuery('');
    history.push(`/apps/${appId}`);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Alert variant="danger">Error loading data: {error}</Alert>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Product & App Manager</h1>
        <p className="text-muted" style={{ fontSize: '0.9375rem' }}>
          Manage applications, products, and their relationships
        </p>
      </div>

      {/* Search */}
      <Card className="mb-4" style={{ border: '1px solid #dee2e6' }}>
        <Card.Body style={{ padding: '1.5rem' }}>
          <Form onSubmit={handleSearchSubmit}>
            <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Find an Application
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by app name, CMDB ID, or description..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                style={{ fontSize: '0.9375rem' }}
              />
              <Button variant="dark" type="submit">
                Search
              </Button>
            </InputGroup>
          </Form>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <ListGroup
              style={{
                position: 'absolute',
                zIndex: 1000,
                width: 'calc(100% - 3rem)',
                marginTop: '0.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {searchResults.map(app => (
                <ListGroup.Item
                  key={app.id}
                  action
                  onClick={() => navigateToApp(app.id)}
                  style={{ padding: '0.75rem 1rem' }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong style={{ fontSize: '0.875rem' }}>{app.name}</strong>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.cmdbId}</div>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: app.resCat === 'Critical' ? '#dc3545' :
                                   app.resCat === 'High' ? '#fd7e14' :
                                   app.resCat === 'Medium' ? '#ffc107' : '#6c757d',
                        color: app.resCat === 'Medium' ? '#000' : '#fff',
                        fontSize: '0.7rem'
                      }}
                    >
                      {app.resCat}
                    </span>
                  </div>
                </ListGroup.Item>
              ))}
              <ListGroup.Item
                action
                onClick={handleSearchSubmit}
                className="text-center text-primary"
                style={{ fontSize: '0.8125rem' }}
              >
                View all results for "{searchQuery}"
              </ListGroup.Item>
            </ListGroup>
          )}

          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="text-muted text-center py-3" style={{ fontSize: '0.875rem' }}>
              No applications found matching "{searchQuery}"
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Metrics */}
      <h5 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Overview</h5>
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card
            style={{ cursor: 'pointer', border: '1px solid #dee2e6' }}
            onClick={() => history.push('/apps')}
          >
            <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: '#212529' }}>
                {metrics.totalApps}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8125rem' }}>Applications</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card
            style={{ cursor: 'pointer', border: '1px solid #dee2e6' }}
            onClick={() => history.push('/products')}
          >
            <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: '#212529' }}>
                {metrics.totalProducts}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8125rem' }}>Products</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card style={{ border: '1px solid #dee2e6' }}>
            <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: '#212529' }}>
                {metrics.totalRepos}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8125rem' }}>Repositories</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card style={{ border: '1px solid #dee2e6' }}>
            <Card.Body className="text-center" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: metrics.openRisks > 0 ? '#dc3545' : '#212529' }}>
                {metrics.openRisks}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8125rem' }}>Open Risks</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Browse By Section */}
      <Row>
        {/* By ResCat */}
        <Col md={6} className="mb-4">
          <Card style={{ border: '1px solid #dee2e6' }}>
            <Card.Header style={{ background: '#f8f9fa', fontSize: '0.875rem', fontWeight: 600 }}>
              Applications by Criticality
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item
                action
                onClick={() => history.push('/apps?resCat=Critical')}
                className="d-flex justify-content-between align-items-center"
                style={{ fontSize: '0.875rem' }}
              >
                <span>
                  <span className="badge me-2" style={{ background: '#dc3545', color: '#fff' }}>Critical</span>
                  Critical Applications
                </span>
                <span className="text-muted">{metrics.criticalApps}</span>
              </ListGroup.Item>
              <ListGroup.Item
                action
                onClick={() => history.push('/apps?resCat=High')}
                className="d-flex justify-content-between align-items-center"
                style={{ fontSize: '0.875rem' }}
              >
                <span>
                  <span className="badge me-2" style={{ background: '#fd7e14', color: '#fff' }}>High</span>
                  High Priority Applications
                </span>
                <span className="text-muted">{metrics.highApps}</span>
              </ListGroup.Item>
              <ListGroup.Item
                action
                onClick={() => history.push('/apps?resCat=Medium')}
                className="d-flex justify-content-between align-items-center"
                style={{ fontSize: '0.875rem' }}
              >
                <span>
                  <span className="badge me-2" style={{ background: '#ffc107', color: '#000' }}>Medium</span>
                  Medium Priority Applications
                </span>
                <span className="text-muted">{metrics.mediumApps}</span>
              </ListGroup.Item>
              <ListGroup.Item
                action
                onClick={() => history.push('/apps?resCat=Low')}
                className="d-flex justify-content-between align-items-center"
                style={{ fontSize: '0.875rem' }}
              >
                <span>
                  <span className="badge me-2" style={{ background: '#6c757d', color: '#fff' }}>Low</span>
                  Low Priority Applications
                </span>
                <span className="text-muted">{metrics.lowApps}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* By Stack */}
        <Col md={6} className="mb-4">
          <Card style={{ border: '1px solid #dee2e6' }}>
            <Card.Header style={{ background: '#f8f9fa', fontSize: '0.875rem', fontWeight: 600 }}>
              Products by Stack
            </Card.Header>
            <ListGroup variant="flush">
              {stacks.length > 0 ? (
                stacks.map(stack => {
                  const stackProducts = products.filter(p => p.stack === stack);
                  return (
                    <ListGroup.Item
                      key={stack}
                      action
                      onClick={() => history.push(`/products?stack=${encodeURIComponent(stack)}`)}
                      className="d-flex justify-content-between align-items-center"
                      style={{ fontSize: '0.875rem' }}
                    >
                      <span>{stack}</span>
                      <span className="text-muted">{stackProducts.length} products</span>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <ListGroup.Item className="text-muted text-center" style={{ fontSize: '0.875rem' }}>
                  No stacks defined
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card style={{ border: '1px solid #dee2e6' }}>
        <Card.Header style={{ background: '#f8f9fa', fontSize: '0.875rem', fontWeight: 600 }}>
          Quick Actions
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-2 mb-md-0">
              <Button
                variant="outline-dark"
                className="w-100"
                onClick={() => history.push('/apps')}
                style={{ fontSize: '0.875rem' }}
              >
                Browse All Applications
              </Button>
            </Col>
            <Col md={4} className="mb-2 mb-md-0">
              <Button
                variant="outline-dark"
                className="w-100"
                onClick={() => history.push('/products')}
                style={{ fontSize: '0.875rem' }}
              >
                Browse All Products
              </Button>
            </Col>
            <Col md={4}>
              <Button
                variant="dark"
                className="w-100"
                onClick={() => history.push('/products/new')}
                style={{ fontSize: '0.875rem' }}
              >
                + Create New Product
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default HomePage;
