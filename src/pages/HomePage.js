import React, { useContext, useState } from 'react';
import { Form, InputGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';

function HomePage() {
  const history = useHistory();
  const { loading, error } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/apps?search=${encodeURIComponent(searchQuery.trim())}`);
    }
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
      <div className="d-flex justify-content-end mb-4">
        <Button variant="dark" onClick={() => history.push('/apps?addApp=true')}>
          + Add Application
        </Button>
      </div>

      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <h1 className="text-center mb-4" style={{ fontSize: '1.75rem', fontWeight: 600 }}>
            Product & App Manager
          </h1>

          <Form onSubmit={handleSearchSubmit}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search apps by name, CMDB ID, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.9375rem' }}
              />
              <Button variant="dark" type="submit">
                Search
              </Button>
            </InputGroup>
          </Form>

          <div className="text-center mt-4">
            <Button variant="outline-secondary" size="sm" onClick={() => history.push('/apps')}>
              Browse All Apps
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default HomePage;
