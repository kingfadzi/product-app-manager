import React, { useState, useContext, useEffect } from 'react';
import { Table, Row, Col, Form, Spinner, Alert, Breadcrumb, Button, Modal } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import useApps from '../hooks/useApps';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';

function AppList() {
  const history = useHistory();
  const location = useLocation();
  const { apps, loading, error } = useContext(AppContext);
  const { createApp, createRepo, createBacklog } = useApps();

  // Parse URL query params for initial filter values
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialResCat = queryParams.get('resCat') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [resCatFilter, setResCatFilter] = useState(initialResCat);

  // Update filters when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
    setResCatFilter(params.get('resCat') || '');
  }, [location.search]);

  // Mock CMDB data for search
  const mockCmdbApps = [
    { correlationId: 'APP-5001', name: 'Customer Portal', tier: 'Gold', owner: 'Jane Smith', resCat: 'Critical' },
    { correlationId: 'APP-5002', name: 'Inventory Management', tier: 'Silver', owner: 'Bob Wilson', resCat: 'High' },
    { correlationId: 'APP-5003', name: 'HR Self-Service', tier: 'Bronze', owner: 'Alice Brown', resCat: 'Medium' },
    { correlationId: 'APP-5004', name: 'Data Analytics Platform', tier: 'Gold', owner: 'Charlie Davis', resCat: 'Critical' },
    { correlationId: 'APP-5005', name: 'Email Gateway', tier: 'Silver', owner: 'Diana Lee', resCat: 'High' },
    { correlationId: 'APP-5006', name: 'Document Management', tier: 'Bronze', owner: 'Frank Miller', resCat: 'Low' },
    { correlationId: 'APP-5007', name: 'Customer Insights', tier: 'Gold', owner: 'Grace Kim', resCat: 'High' },
    { correlationId: 'APP-5008', name: 'Supply Chain Tracker', tier: 'Silver', owner: 'Henry Chen', resCat: 'Medium' },
  ];

  // Add Application wizard state
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCmdbApp, setSelectedCmdbApp] = useState(null);
  const [appData, setAppData] = useState({
    name: '',
    cmdbId: '',
    description: '',
    parent: '',
    resCat: '',
    selectedProducts: [],
    repos: [],
    backlogs: []
  });

  // Temp state for adding repos/backlogs
  const [newRepo, setNewRepo] = useState({ name: '', path: '', platform: 'GitLab', role: 'backend' });
  const [newBacklog, setNewBacklog] = useState({ projectKey: '', projectName: '', purpose: 'product' });

  const openAddWizard = () => {
    setShowAddWizard(true);
    setWizardStep(1);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCmdbApp(null);
    setAppData({
      name: '',
      cmdbId: '',
      description: '',
      parent: '',
      resCat: '',
      selectedProducts: [],
      repos: [],
      backlogs: []
    });
    setNewRepo({ name: '', path: '', platform: 'GitLab', role: 'backend' });
    setNewBacklog({ projectKey: '', projectName: '', purpose: 'product' });
  };

  const closeAddWizard = () => {
    setShowAddWizard(false);
    setWizardStep(1);
  };

  // Search CMDB apps
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = mockCmdbApps.filter(app =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.correlationId.toLowerCase().includes(query.toLowerCase())
    );
    // Filter out already onboarded apps
    const filtered = results.filter(cmdbApp =>
      !apps.some(existingApp => existingApp.cmdbId === cmdbApp.correlationId)
    );
    setSearchResults(filtered);
  };

  // Select app from search results
  const selectCmdbApp = (cmdbApp) => {
    setSelectedCmdbApp(cmdbApp);
    setAppData({
      ...appData,
      name: cmdbApp.name,
      cmdbId: cmdbApp.correlationId,
      resCat: cmdbApp.resCat
    });
    setWizardStep(2);
  };

  const toggleProduct = (productId) => {
    setAppData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  const addRepo = () => {
    if (newRepo.name && newRepo.path) {
      setAppData(prev => ({
        ...prev,
        repos: [...prev.repos, { ...newRepo, id: `repo-${Date.now()}` }]
      }));
      setNewRepo({ name: '', path: '', platform: 'GitLab', role: 'backend' });
    }
  };

  const removeRepo = (repoId) => {
    setAppData(prev => ({
      ...prev,
      repos: prev.repos.filter(r => r.id !== repoId)
    }));
  };

  const addBacklog = () => {
    if (newBacklog.projectKey && newBacklog.projectName) {
      setAppData(prev => ({
        ...prev,
        backlogs: [...prev.backlogs, { ...newBacklog, id: `backlog-${Date.now()}` }]
      }));
      setNewBacklog({ projectKey: '', projectName: '', purpose: 'product' });
    }
  };

  const removeBacklog = (backlogId) => {
    setAppData(prev => ({
      ...prev,
      backlogs: prev.backlogs.filter(b => b.id !== backlogId)
    }));
  };

  const handleCreateApp = async () => {
    try {
      // Create the app via API
      const appPayload = {
        name: appData.name,
        cmdbId: appData.cmdbId,
        description: appData.description,
        parent: appData.parent,
        resCat: appData.resCat,
        repoCount: appData.repos.length,
        backlogCount: appData.backlogs.length,
        openRisks: 0
      };
      const createdApp = await createApp(appPayload);

      // Create repos for the new app
      for (const repo of appData.repos) {
        await createRepo(createdApp.id, {
          name: repo.name,
          path: repo.path,
          platform: repo.platform,
          role: repo.role
        });
      }

      // Create backlogs for the new app
      for (const backlog of appData.backlogs) {
        await createBacklog(createdApp.id, {
          projectKey: backlog.projectKey,
          projectName: backlog.projectName,
          purpose: backlog.purpose
        });
      }

      closeAddWizard();
      history.push(`/apps/${createdApp.id}`);
    } catch (err) {
      alert('Failed to create application: ' + err.message);
    }
  };

  // Get products from context
  const { products } = useContext(AppContext);

  const filteredApps = apps.filter(app => {
    const matchesSearch = !searchTerm ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.cmdbId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesResCat = !resCatFilter || app.resCat === resCatFilter;

    return matchesSearch && matchesResCat;
  });

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Applications</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Applications</h1>
        <Button variant="dark" onClick={openAddWizard}>+ Add Application</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            as="select"
            value={resCatFilter}
            onChange={(e) => setResCatFilter(e.target.value)}
          >
            <option value="">All ResCat</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Form.Control>
        </Col>
      </Row>

      {filteredApps.length === 0 ? (
        <EmptyState
          title="No apps found"
          description={searchTerm || resCatFilter
            ? "Try adjusting your filters."
            : "No apps are currently available."
          }
        />
      ) : (
        <Table striped bordered hover style={{ whiteSpace: 'nowrap' }}>
          <thead>
            <tr>
              <th>App ID</th>
              <th>Name</th>
              <th>Parent</th>
              <th>ResCat</th>
              <th className="text-center">Repos</th>
              <th className="text-center">Backlogs</th>
              <th className="text-center">Open Risks</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr
                key={app.id}
                style={{ cursor: 'pointer' }}
                onClick={() => history.push(`/apps/${app.id}`)}
              >
                <td>{app.cmdbId}</td>
                <td style={{ fontWeight: 500 }}>{app.name}</td>
                <td>{app.parent || '-'}</td>
                <td>{app.resCat || '-'}</td>
                <td className="text-center">{app.repoCount || 0}</td>
                <td className="text-center">{app.backlogCount || 0}</td>
                <td className="text-center">{app.openRisks || 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Application Wizard Modal */}
      <Modal show={showAddWizard} onHide={closeAddWizard} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>Add New Application</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0 }}>
          {/* Step Progress Indicator */}
          <div className="d-flex justify-content-between align-items-center my-3">
            {['Search', 'Portfolio', 'Repos', 'Backlogs', 'Review'].map((step, idx) => (
              <React.Fragment key={step}>
                <div className="text-center">
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: wizardStep === idx + 1 ? '#212529' : wizardStep > idx + 1 ? '#22c55e' : '#e9ecef',
                      color: wizardStep >= idx + 1 ? '#fff' : '#6c757d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      margin: '0 auto 0.25rem'
                    }}
                  >
                    {wizardStep > idx + 1 ? '✓' : idx + 1}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#6c757d' }}>{step}</div>
                </div>
                {idx < 4 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      background: wizardStep > idx + 1 ? '#22c55e' : '#e9ecef',
                      margin: '0 0.25rem',
                      marginBottom: '1rem'
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Search */}
          {wizardStep === 1 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Search Application</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Search by Application ID or Name from ServiceNow CMDB.
              </p>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  Search by Application ID or Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., APP-001 or Core Banking"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                  autoFocus
                />
              </Form.Group>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div style={{ border: '1px solid #dee2e6', borderRadius: '0.25rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {searchResults.map(app => (
                    <div
                      key={app.correlationId}
                      onClick={() => selectCmdbApp(app)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #dee2e6',
                        cursor: 'pointer',
                        background: '#fff'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong style={{ fontSize: '0.875rem' }}>{app.name}</strong>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.correlationId}</div>
                        </div>
                        <div className="text-end">
                          <span
                            className="badge"
                            style={{
                              background: app.tier === 'Gold' ? '#ffc107' : app.tier === 'Silver' ? '#6c757d' : '#cd7f32',
                              color: app.tier === 'Gold' ? '#000' : '#fff',
                              fontSize: '0.7rem'
                            }}
                          >
                            {app.tier}
                          </span>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>{app.owner}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="text-center text-muted py-4">
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>No applications found matching your search.</p>
                  <p style={{ fontSize: '0.75rem' }}>Make sure the application exists in ServiceNow CMDB.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Portfolio/Product Assignment */}
          {wizardStep === 2 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Product Assignment</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Select the product(s) this application belongs to. You can skip this step.
              </p>

              {products && products.length > 0 ? (
                <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '0.5rem' }}>
                  {products.map(product => (
                    <Form.Check
                      key={product.id}
                      type="checkbox"
                      id={`product-${product.id}`}
                      className="mb-2"
                      checked={appData.selectedProducts.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      label={
                        <span style={{ fontSize: '0.875rem' }}>
                          {product.name}
                          <span className="text-muted ml-2">({product.stack})</span>
                        </span>
                      }
                    />
                  ))}
                </div>
              ) : (
                <Alert variant="light" style={{ fontSize: '0.8125rem' }}>
                  No products available. You can assign this app to products later.
                </Alert>
              )}

              {appData.selectedProducts.length > 0 && (
                <div className="mt-2" style={{ fontSize: '0.8125rem' }}>
                  <strong>Selected:</strong> {appData.selectedProducts.length} product(s)
                </div>
              )}
            </div>
          )}

          {/* Step 3: Repositories */}
          {wizardStep === 3 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Repositories</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Add source code repositories for this application. You can skip this step.
              </p>

              {/* Add Repo Form */}
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Repository Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. payment-api"
                        value={newRepo.name}
                        onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                        style={{ fontSize: '0.8125rem' }}
                        size="sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Repository Path</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. org/payment-api"
                        value={newRepo.path}
                        onChange={(e) => setNewRepo({ ...newRepo, path: e.target.value })}
                        style={{ fontSize: '0.8125rem' }}
                        size="sm"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Platform</Form.Label>
                      <Form.Control
                        as="select"
                        value={newRepo.platform}
                        onChange={(e) => setNewRepo({ ...newRepo, platform: e.target.value })}
                        style={{ fontSize: '0.8125rem' }}
                        size="sm"
                      >
                        <option value="GitLab">GitLab</option>
                        <option value="Bitbucket">Bitbucket</option>
                        <option value="GitHub">GitHub</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Role</Form.Label>
                      <Form.Control
                        as="select"
                        value={newRepo.role}
                        onChange={(e) => setNewRepo({ ...newRepo, role: e.target.value })}
                        style={{ fontSize: '0.8125rem' }}
                        size="sm"
                      >
                        <option value="backend">Backend</option>
                        <option value="frontend">Frontend</option>
                        <option value="infra">Infrastructure</option>
                        <option value="docs">Documentation</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={addRepo}
                      disabled={!newRepo.name || !newRepo.path}
                      className="mb-2 w-100"
                    >
                      + Add
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Repo List */}
              {appData.repos.length > 0 ? (
                <Table size="sm" style={{ fontSize: '0.8125rem' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Platform</th>
                      <th>Role</th>
                      <th style={{ width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appData.repos.map(repo => (
                      <tr key={repo.id}>
                        <td>{repo.name}</td>
                        <td>{repo.platform}</td>
                        <td>{repo.role}</td>
                        <td>
                          <Button variant="link" size="sm" className="text-danger p-0" onClick={() => removeRepo(repo.id)}>
                            ✕
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-3" style={{ fontSize: '0.8125rem' }}>
                  No repositories added yet
                </div>
              )}
            </div>
          )}

          {/* Step 4: Backlogs */}
          {wizardStep === 4 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Backlogs</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Add Jira projects/backlogs for this application. You can skip this step.
              </p>

              {/* Add Backlog Form */}
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Project Key</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. PAY"
                        value={newBacklog.projectKey}
                        onChange={(e) => setNewBacklog({ ...newBacklog, projectKey: e.target.value.toUpperCase() })}
                        style={{ fontSize: '0.8125rem' }}
                        size="sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Project Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Payment Gateway"
                        value={newBacklog.projectName}
                        onChange={(e) => setNewBacklog({ ...newBacklog, projectName: e.target.value })}
                        style={{ fontSize: '0.8125rem' }}
                        size="sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500 }}>Purpose</Form.Label>
                      <Form.Control
                        as="select"
                        value={newBacklog.purpose}
                        onChange={(e) => setNewBacklog({ ...newBacklog, purpose: e.target.value })}
                        style={{ fontSize: '0.8125rem' }}
                        size="sm"
                      >
                        <option value="product">Product</option>
                        <option value="ops">Operations</option>
                        <option value="security">Security</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={addBacklog}
                      disabled={!newBacklog.projectKey || !newBacklog.projectName}
                      className="mb-2 w-100"
                    >
                      + Add
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Backlog List */}
              {appData.backlogs.length > 0 ? (
                <Table size="sm" style={{ fontSize: '0.8125rem' }}>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Name</th>
                      <th>Purpose</th>
                      <th style={{ width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appData.backlogs.map(backlog => (
                      <tr key={backlog.id}>
                        <td>{backlog.projectKey}</td>
                        <td>{backlog.projectName}</td>
                        <td>{backlog.purpose}</td>
                        <td>
                          <Button variant="link" size="sm" className="text-danger p-0" onClick={() => removeBacklog(backlog.id)}>
                            ✕
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-3" style={{ fontSize: '0.8125rem' }}>
                  No backlogs added yet
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {wizardStep === 5 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Review & Confirm</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Review the application details before onboarding.
              </p>

              <Alert variant="light" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6' }}>
                <strong style={{ fontSize: '0.875rem' }}>Application Summary</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  <div><strong>Name:</strong> {appData.name}</div>
                  <div><strong>CMDB ID:</strong> {appData.cmdbId}</div>
                  <div><strong>Tier:</strong> {selectedCmdbApp?.tier || '-'}</div>
                  <div><strong>Owner:</strong> {selectedCmdbApp?.owner || '-'}</div>
                  <div><strong>ResCat:</strong> {appData.resCat}</div>
                  <div><strong>Products:</strong> {appData.selectedProducts.length > 0
                    ? products.filter(p => appData.selectedProducts.includes(p.id)).map(p => p.name).join(', ')
                    : 'None'}</div>
                  <div><strong>Repositories:</strong> {appData.repos.length > 0
                    ? appData.repos.map(r => r.name).join(', ')
                    : 'None'}</div>
                  <div><strong>Backlogs:</strong> {appData.backlogs.length > 0
                    ? appData.backlogs.map(b => b.projectKey).join(', ')
                    : 'None'}</div>
                </div>
              </Alert>

              <Alert variant="info" style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
                <strong>What happens next:</strong>
                <ul className="mb-0" style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                  <li>Application will be onboarded from CMDB</li>
                  <li>Repositories and backlogs will be linked</li>
                  <li>Product associations will be established</li>
                  <li>You can add contacts and set up risk profile later</li>
                </ul>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-between' }}>
          {wizardStep > 1 ? (
            <Button variant="outline-secondary" onClick={() => setWizardStep(wizardStep - 1)} style={{ fontSize: '0.875rem' }}>
              ← Back
            </Button>
          ) : (
            <Button variant="outline-secondary" onClick={closeAddWizard} style={{ fontSize: '0.875rem' }}>
              Cancel
            </Button>
          )}
          <div>
            {wizardStep === 1 ? (
              <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Select an application to continue</span>
            ) : wizardStep < 5 ? (
              <Button
                variant="dark"
                onClick={() => setWizardStep(wizardStep + 1)}
                style={{ fontSize: '0.875rem' }}
              >
                Next →
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleCreateApp}
                style={{ fontSize: '0.875rem' }}
              >
                Onboard Application
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </PageLayout>
  );
}

export default AppList;
