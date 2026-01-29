import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Button, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';
import { usePagination } from '../hooks/usePagination';
import TablePagination from '../components/common/TablePagination';

const RESULTS_PER_PAGE = 20;

function SearchResults() {
  const history = useHistory();
  const location = useLocation();
  const { apps, loading, error } = useContext(AppContext);

  // Parse query params
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Update search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  // Filter apps
  const filteredApps = useMemo(() => {
    if (!initialQuery) return [];
    const lowerQuery = initialQuery.toLowerCase();
    return apps.filter(app =>
      app.name.toLowerCase().includes(lowerQuery) ||
      app.cmdbId.toLowerCase().includes(lowerQuery) ||
      (app.description && app.description.toLowerCase().includes(lowerQuery))
    );
  }, [apps, initialQuery]);

  // Use pagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    totalItems,
    showPagination,
    resetPage
  } = usePagination(filteredApps, RESULTS_PER_PAGE);

  // Reset pagination when query changes
  useEffect(() => {
    resetPage();
  }, [initialQuery, resetPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
      {/* Search Bar */}
      <Form onSubmit={handleSearchSubmit} className="mb-4">
        <Row>
          <Col md={6} lg={5}>
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
          </Col>
        </Row>
      </Form>

      {initialQuery ? (
        <>
          <div className="mb-3" style={{ fontSize: '0.9375rem', color: '#6c757d' }}>
            {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} found for "{initialQuery}"
          </div>

          {filteredApps.length === 0 ? (
            <Card style={{ border: '1px solid #dee2e6' }}>
              <Card.Body className="text-center py-5">
                <div className="text-muted">No apps found matching "{initialQuery}"</div>
                <div className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>
                  Try different search terms
                </div>
              </Card.Body>
            </Card>
          ) : (
            <>
              <Table striped bordered hover style={{ whiteSpace: 'nowrap' }}>
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Name</th>
                    <th>Stack</th>
                    <th>Product</th>
                    <th>ResCat</th>
                    <th className="text-center">Repos</th>
                    <th className="text-center">Backlogs</th>
                    <th className="text-center">Open Risks</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(app => (
                    <tr
                      key={app.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => history.push(`/apps/${app.id}`)}
                    >
                      <td>{app.cmdbId}</td>
                      <td style={{ fontWeight: 500 }}>{app.name}</td>
                      <td>{app.stack || '-'}</td>
                      <td>{app.productName || '-'}</td>
                      <td>{app.resCat || '-'}</td>
                      <td className="text-center">{app.repoCount || 0}</td>
                      <td className="text-center">{app.backlogCount || 0}</td>
                      <td className="text-center">{app.openRisks || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {showPagination && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={totalItems}
                  itemLabel="apps"
                />
              )}
            </>
          )}
        </>
      ) : (
        <Card style={{ border: '1px solid #dee2e6' }}>
          <Card.Body className="text-center py-5">
            <div className="text-muted">Enter a search term to find apps</div>
          </Card.Body>
        </Card>
      )}
    </PageLayout>
  );
}

export default SearchResults;
