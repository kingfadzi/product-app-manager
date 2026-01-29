import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, ListGroup, Form, Table, Badge, Alert, InputGroup } from 'react-bootstrap';
import TablePagination from '../common/TablePagination';
import { usePagination } from '../../hooks/usePagination';
import RemediationBox from '../common/RemediationBox';
import { appsApi, productsApi } from '../../services/api';

// Wrapper component for paginated tables in modals
function PaginatedTableWrapper({ data, itemsPerPage = 5, renderTable, itemLabel = 'items' }) {
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    totalItems,
    showPagination
  } = usePagination(data, itemsPerPage);

  return (
    <>
      {renderTable(paginatedData)}
      {showPagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          size="sm"
          showInfo={false}
          itemLabel={itemLabel}
        />
      )}
    </>
  );
}

// Step names for the wizard
const STEPS = ['search', 'product', 'details', 'instances', 'repos', 'jira', 'docs', 'review'];
const STEP_LABELS = ['Search', 'Product', 'Details', 'Instances', 'Repos', 'Jira', 'Docs', 'Review'];

// Required document types
const DOC_TYPES = [
  'Product Vision',
  'Product Roadmap',
  'Architecture Vision',
  'Service Vision',
  'Security Vision',
  'Test Strategy'
];

// Step Indicator Component
function StepIndicator({ currentStep, steps, labels, onStepClick }) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="d-flex justify-content-between mb-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isClickable = index < currentIndex;

        return (
          <div
            key={step}
            className="d-flex flex-column align-items-center"
            style={{ flex: 1, cursor: isClickable ? 'pointer' : 'default' }}
            onClick={() => isClickable && onStepClick(step)}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isCompleted || isCurrent ? '#007bff' : '#e9ecef',
                color: isCompleted || isCurrent ? 'white' : '#6c757d',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {isCompleted ? '✓' : index + 1}
            </div>
            <small
              className="mt-1 text-center"
              style={{
                color: isCurrent ? '#007bff' : '#6c757d',
                fontWeight: isCurrent ? 'bold' : 'normal',
                fontSize: '11px'
              }}
            >
              {labels[index]}
            </small>
          </div>
        );
      })}
    </div>
  );
}

function AddAppModal({ show, onHide, onAdd, existingAppIds = [] }) {
  // Step navigation
  const [currentStep, setCurrentStep] = useState('search');

  // Step 1: Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Step 2: Product Selection
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Step 3: Service Instances
  const [serviceInstances, setServiceInstances] = useState([]);

  // Step 5: Repos
  const [availableRepos, setAvailableRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [repoLookupTerm, setRepoLookupTerm] = useState('');
  const [repoLookupResults, setRepoLookupResults] = useState([]);
  const [manualRepos, setManualRepos] = useState([]);

  // Step 6: Jira
  const [availableJira, setAvailableJira] = useState([]);
  const [selectedJira, setSelectedJira] = useState([]);
  const [jiraLookupTerm, setJiraLookupTerm] = useState('');
  const [jiraLookupResults, setJiraLookupResults] = useState([]);
  const [manualJira, setManualJira] = useState([]);

  // Step 7: Documentation
  const [addedDocs, setAddedDocs] = useState([]);
  const [docType, setDocType] = useState('');
  const [docUrl, setDocUrl] = useState('');

  // Error handling state
  const [error, setError] = useState(null);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Search CMDB when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setSearchLoading(true);
      fetch(`/api/cmdb/search?q=${encodeURIComponent(searchTerm)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setSearchLoading(false);
        })
        .catch((err) => {
          setSearchResults([]);
          setSearchLoading(false);
          setError('Failed to search applications. Please try again.');
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Search products when product search term changes
  useEffect(() => {
    if (productSearchTerm.length >= 2) {
      setProductSearchLoading(true);
      fetch(`/api/products/search?q=${encodeURIComponent(productSearchTerm)}`)
        .then(res => res.json())
        .then(data => {
          setProductSearchResults(data);
          setProductSearchLoading(false);
        })
        .catch((err) => {
          setProductSearchResults([]);
          setProductSearchLoading(false);
          setError('Failed to search products. Please try again.');
        });
    } else {
      setProductSearchResults([]);
    }
  }, [productSearchTerm]);

  // Fetch service instances, repos, and jira when app is selected
  useEffect(() => {
    if (selectedApp) {
      Promise.all([
        fetch(`/api/apps/${selectedApp.cmdbId}/service-instances`).then(res => res.json()),
        fetch(`/api/apps/${selectedApp.cmdbId}/available-repos`).then(res => res.json()),
        fetch(`/api/apps/${selectedApp.cmdbId}/available-jira`).then(res => res.json()),
      ])
        .then(([instances, repos, jira]) => {
          setServiceInstances(instances);
          setAvailableRepos(repos);
          setAvailableJira(jira);
        })
        .catch((err) => {
          setServiceInstances([]);
          setAvailableRepos([]);
          setAvailableJira([]);
          setError('Failed to load app data. Please try again.');
        });
    }
  }, [selectedApp]);

  // Repo lookup - search all repos by slug
  useEffect(() => {
    if (repoLookupTerm.length >= 2) {
      fetch(`/api/repos/search?q=${encodeURIComponent(repoLookupTerm)}`)
        .then(res => res.json())
        .then(data => setRepoLookupResults(data))
        .catch((err) => {
          setRepoLookupResults([]);
          setError('Failed to search repositories. Please try again.');
        });
    } else {
      setRepoLookupResults([]);
    }
  }, [repoLookupTerm]);

  // Jira lookup - search all jira projects by key
  useEffect(() => {
    if (jiraLookupTerm.length >= 2) {
      fetch(`/api/jira/search?q=${encodeURIComponent(jiraLookupTerm)}`)
        .then(res => res.json())
        .then(data => setJiraLookupResults(data))
        .catch((err) => {
          setJiraLookupResults([]);
          setError('Failed to search Jira projects. Please try again.');
        });
    } else {
      setJiraLookupResults([]);
    }
  }, [jiraLookupTerm]);

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setCurrentStep('product');
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentStep('details');
  };

  const handleClose = () => {
    setCurrentStep('search');
    setSearchTerm('');
    setSearchResults([]);
    setSearchLoading(false);
    setSelectedApp(null);
    setProductSearchTerm('');
    setProductSearchResults([]);
    setProductSearchLoading(false);
    setSelectedProduct(null);
    setServiceInstances([]);
    setAvailableRepos([]);
    setSelectedRepos([]);
    setRepoLookupTerm('');
    setRepoLookupResults([]);
    setManualRepos([]);
    setAvailableJira([]);
    setSelectedJira([]);
    setJiraLookupTerm('');
    setJiraLookupResults([]);
    setManualJira([]);
    setAddedDocs([]);
    setDocType('');
    setDocUrl('');
    setError(null);
    onHide();
  };

  const handleBack = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  // Get all selected repos (from available + manual)
  const getAllSelectedRepos = () => {
    const fromAvailable = selectedRepos.map(repoId => availableRepos.find(r => r.repoId === repoId)).filter(Boolean);
    return [...fromAvailable, ...manualRepos];
  };

  // Get all selected jira projects (from available + manual)
  const getAllSelectedJira = () => {
    const fromAvailable = selectedJira.map(key => availableJira.find(j => j.projectKey === key)).filter(Boolean);
    return [...fromAvailable, ...manualJira];
  };

  const handleFinish = () => {
    onAdd([selectedApp], {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      repos: getAllSelectedRepos(),
      jiraProjects: getAllSelectedJira(),
      documentation: addedDocs
    });
    handleClose();
  };

  // Checkbox handlers for repos
  const handleRepoToggle = (repoId) => {
    setSelectedRepos(prev =>
      prev.includes(repoId)
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleSelectAllRepos = (e) => {
    if (e.target.checked) {
      setSelectedRepos(availableRepos.map(r => r.repoId));
    } else {
      setSelectedRepos([]);
    }
  };

  // Add repo from lookup
  const handleAddRepoFromLookup = (repo) => {
    const alreadyInAvailable = availableRepos.some(r => r.repoId === repo.repoId);
    const alreadyInManual = manualRepos.some(r => r.repoId === repo.repoId);

    if (!alreadyInAvailable && !alreadyInManual) {
      setManualRepos([...manualRepos, repo]);
    } else if (alreadyInAvailable && !selectedRepos.includes(repo.repoId)) {
      setSelectedRepos([...selectedRepos, repo.repoId]);
    }
    setRepoLookupTerm('');
    setRepoLookupResults([]);
  };

  // Remove manual repo
  const handleRemoveManualRepo = (repoId) => {
    setManualRepos(manualRepos.filter(r => r.repoId !== repoId));
  };

  // Checkbox handlers for jira
  const handleJiraToggle = (projectKey) => {
    setSelectedJira(prev =>
      prev.includes(projectKey)
        ? prev.filter(k => k !== projectKey)
        : [...prev, projectKey]
    );
  };

  const handleSelectAllJira = (e) => {
    if (e.target.checked) {
      setSelectedJira(availableJira.map(j => j.projectKey));
    } else {
      setSelectedJira([]);
    }
  };

  // Add jira from lookup
  const handleAddJiraFromLookup = (project) => {
    const alreadyInAvailable = availableJira.some(j => j.projectKey === project.projectKey);
    const alreadyInManual = manualJira.some(j => j.projectKey === project.projectKey);

    if (!alreadyInAvailable && !alreadyInManual) {
      setManualJira([...manualJira, project]);
    } else if (alreadyInAvailable && !selectedJira.includes(project.projectKey)) {
      setSelectedJira([...selectedJira, project.projectKey]);
    }
    setJiraLookupTerm('');
    setJiraLookupResults([]);
  };

  // Remove manual jira
  const handleRemoveManualJira = (projectKey) => {
    setManualJira(manualJira.filter(j => j.projectKey !== projectKey));
  };

  // Document handlers
  const handleAddDoc = () => {
    if (docType && docUrl) {
      setAddedDocs([...addedDocs, { type: docType, url: docUrl }]);
      setDocType('');
      setDocUrl('');
    }
  };

  const handleRemoveDoc = (type) => {
    setAddedDocs(addedDocs.filter(d => d.type !== type));
  };

  const getAvailableDocTypes = () => {
    const addedTypes = addedDocs.map(d => d.type);
    return DOC_TYPES.filter(t => !addedTypes.includes(t));
  };

  const getMissingDocTypes = () => {
    const addedTypes = addedDocs.map(d => d.type);
    return DOC_TYPES.filter(t => !addedTypes.includes(t));
  };

  // Validation helpers
  const totalSelectedRepos = selectedRepos.length + manualRepos.length;
  const totalSelectedJira = selectedJira.length + manualJira.length;
  const canProceedFromInstances = serviceInstances.length > 0;
  const canProceedFromRepos = totalSelectedRepos > 0;
  const canProceedFromJira = totalSelectedJira > 0;
  const canProceedFromDocs = addedDocs.length === DOC_TYPES.length;

  // Get environment summary for service instances
  const getEnvironmentSummary = () => {
    const counts = {};
    serviceInstances.forEach(si => {
      counts[si.environment] = (counts[si.environment] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([env, count]) => `${env} (${count})`)
      .join(', ');
  };

  // Get repo type counts
  const getRepoTypeCounts = () => {
    const counts = { GitLab: 0, BitBucket: 0 };
    availableRepos.forEach(r => {
      if (counts[r.type] !== undefined) counts[r.type]++;
    });
    return counts;
  };

  // Get resilience category badge color
  const getResCatBadgeColor = (resCat) => {
    switch (resCat) {
      case 'Critical': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  // Get environment badge color
  const getEnvBadgeColor = (env) => {
    switch (env) {
      case 'Prod': return 'success';
      case 'DR': return 'danger';
      case 'UAT': return 'warning';
      case 'Dev': return 'info';
      default: return 'secondary';
    }
  };

  // Render Step 1: Search
  const renderSearchStep = () => {
    return (
      <>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by App ID or Application Name..."
          />
        </Form.Group>

        <ListGroup style={{ maxHeight: '350px', overflow: 'auto' }}>
          {searchTerm.length === 0 ? (
            <ListGroup.Item className="text-center text-muted">
              Start typing to search for applications in CMDB
            </ListGroup.Item>
          ) : searchTerm.length < 2 ? (
            <ListGroup.Item className="text-center text-muted">
              Type at least 2 characters to search
            </ListGroup.Item>
          ) : searchLoading ? (
            <ListGroup.Item className="text-center text-muted">
              Searching CMDB...
            </ListGroup.Item>
          ) : searchResults.length === 0 ? (
            <ListGroup.Item className="text-center text-muted">
              No applications found in CMDB
            </ListGroup.Item>
          ) : (
            searchResults.map(app => (
              <ListGroup.Item
                key={app.cmdbId}
                action
                onClick={() => handleSelectApp(app)}
                className="p-3"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{app.name}</strong>
                    {app.isOnboarded && app.memberOfProducts.length > 0 && (
                      <Badge bg="warning" text="dark" className="ms-2">
                        In: {app.memberOfProducts.map(p => p.name).join(', ')}
                      </Badge>
                    )}
                    <div className="text-muted small">{app.cmdbId}</div>
                  </div>
                  <div className="text-end">
                    <Badge bg={app.tier === 'Gold' ? 'warning' : app.tier === 'Silver' ? 'secondary' : 'info'}>
                      {app.tier}
                    </Badge>
                    <div className="text-muted small">{app.productOwner}</div>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>

        <RemediationBox
          dataSource="Application data is sourced from CMDB."
          contactEmail="cmdb-support@example.com"
          linkUrl="https://servicenow.example.com/cmdb"
          linkText="Open ServiceNow CMDB"
        />
      </>
    );
  };

  // Render Step 2: Product Selection
  const renderProductStep = () => {
    // Check if selected app is already in any products
    const appProducts = selectedApp?.memberOfProducts || [];

    return (
      <>
        <Form.Group className="mb-3">
          <Form.Label>Select a product for this application</Form.Label>
          <Form.Control
            type="text"
            value={productSearchTerm}
            onChange={(e) => setProductSearchTerm(e.target.value)}
            placeholder="Search products by name..."
          />
        </Form.Group>

        <ListGroup style={{ maxHeight: '300px', overflow: 'auto' }}>
          {productSearchTerm.length < 2 ? (
            <ListGroup.Item className="text-center text-muted">
              Type at least 2 characters to search products
            </ListGroup.Item>
          ) : productSearchLoading ? (
            <ListGroup.Item className="text-center text-muted">
              Searching products...
            </ListGroup.Item>
          ) : productSearchResults.length === 0 ? (
            <ListGroup.Item className="text-center text-muted">
              No products found
            </ListGroup.Item>
          ) : (
            productSearchResults.map(product => {
              const isInThisProduct = appProducts.some(p => p.id === product.id);
              const otherProducts = appProducts.filter(p => p.id !== product.id);

              return (
                <ListGroup.Item
                  key={product.id}
                  action={!isInThisProduct}
                  onClick={() => !isInThisProduct && handleSelectProduct(product)}
                  className={`p-3 ${isInThisProduct ? 'bg-light' : ''}`}
                  style={{ cursor: isInThisProduct ? 'not-allowed' : 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{product.name}</strong>
                      {isInThisProduct && (
                        <Badge bg="secondary" className="ms-2">App already in this product</Badge>
                      )}
                      <div className="text-muted small">{product.description}</div>
                      {!isInThisProduct && otherProducts.length > 0 && (
                        <div className="small mt-1">
                          <Badge bg="warning" text="dark">Note</Badge>
                          <span className="text-muted ms-2">
                            This app is already in: {otherProducts.map(p => p.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>

        {selectedProduct && (
          <Alert variant="info" className="mt-3">
            <strong>Selected:</strong> {selectedProduct.name}
          </Alert>
        )}
      </>
    );
  };

  // Render Step 3: App Details
  const renderDetailsStep = () => (
    <>
      {selectedApp && (
        <Table bordered>
          <tbody>
            <tr>
              <th style={{ width: '40%' }}>Application ID</th>
              <td>{selectedApp.cmdbId}</td>
            </tr>
            <tr>
              <th>Application Name</th>
              <td>{selectedApp.name}</td>
            </tr>
            <tr>
              <th>Product Owner</th>
              <td>{selectedApp.productOwner}</td>
            </tr>
            <tr>
              <th>System Architect</th>
              <td>{selectedApp.systemArchitect}</td>
            </tr>
            <tr>
              <th>Application Tier</th>
              <td>{selectedApp.tier}</td>
            </tr>
            <tr>
              <th>Resilience Category</th>
              <td>
                <Badge bg={getResCatBadgeColor(selectedApp.resCat)}>
                  {selectedApp.resCat}
                </Badge>
              </td>
            </tr>
            <tr>
              <th>Operational Status</th>
              <td>{selectedApp.operationalStatus}</td>
            </tr>
          </tbody>
        </Table>
      )}

      {(availableRepos.length === 0 || availableJira.length === 0) && (
        <Alert variant="warning">
          <strong>Warning:</strong> This application is missing{' '}
          {availableRepos.length === 0 && availableJira.length === 0
            ? 'repositories and Jira projects'
            : availableRepos.length === 0
            ? 'repositories'
            : 'Jira projects'}{' '}
          in DSI. You can add them manually in the following steps.
        </Alert>
      )}

      <RemediationBox
        dataSource="Application details are sourced from CMDB."
        contactEmail="cmdb-support@example.com"
        linkUrl="https://servicenow.example.com/cmdb"
        linkText="Open ServiceNow CMDB"
      />
    </>
  );

  // Render Step 4: Service Instances
  const renderInstancesStep = () => (
    <>
      {serviceInstances.length === 0 ? (
        <Alert variant="danger">
          <strong>Cannot proceed:</strong> No service instances found for this application in CMDB.
          Service instances are required to complete onboarding. Please contact CMDB support to register service instances.
        </Alert>
      ) : (
        <>
          <div className="mb-3 text-muted small">
            <strong>Summary:</strong> {getEnvironmentSummary()}
          </div>

          <PaginatedTableWrapper
            data={serviceInstances}
            itemsPerPage={5}
            itemLabel="instances"
            renderTable={(paginatedData) => (
              <Table bordered hover size="sm">
                <thead className="bg-light">
                  <tr>
                    <th>Environment</th>
                    <th>SI ID</th>
                    <th>Instance Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(si => (
                    <tr key={si.siId}>
                      <td>
                        <Badge bg={getEnvBadgeColor(si.environment)}>
                          {si.environment}
                        </Badge>
                      </td>
                      <td>{si.siId}</td>
                      <td>{si.name}</td>
                      <td>{si.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          />
        </>
      )}

      <RemediationBox
        dataSource="Service instance data is sourced from CMDB."
        contactEmail="cmdb-support@example.com"
        linkUrl="https://servicenow.example.com/cmdb"
        linkText="Open ServiceNow CMDB"
      />
    </>
  );

  // Render Step 5: Repos
  const renderReposStep = () => {
    const repoCounts = getRepoTypeCounts();
    const allSelectedRepos = getAllSelectedRepos();
    const bitbucketSelected = allSelectedRepos.some(r => r?.type === 'BitBucket');

    return (
      <>
        {/* Lookup Section */}
        <div className="mb-3 p-3 border rounded bg-light">
          <Form.Label className="small fw-bold">Add Repository by Slug</Form.Label>
          <InputGroup size="sm">
            <Form.Control
              type="text"
              value={repoLookupTerm}
              onChange={(e) => setRepoLookupTerm(e.target.value)}
              placeholder="Search by repo slug or name..."
            />
          </InputGroup>
          {repoLookupTerm.length >= 2 && repoLookupResults.length > 0 && (
            <ListGroup className="mt-2" style={{ maxHeight: '150px', overflow: 'auto' }}>
              {repoLookupResults.map(repo => (
                <ListGroup.Item
                  key={repo.repoId}
                  action
                  onClick={() => handleAddRepoFromLookup(repo)}
                  className="py-2 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <Badge bg={repo.type === 'GitLab' ? 'success' : 'primary'} className="me-2">
                      {repo.type}
                    </Badge>
                    {repo.name}
                  </div>
                  <small className="text-primary">+ Add</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          {repoLookupTerm.length >= 2 && repoLookupResults.length === 0 && (
            <small className="text-muted">No repositories found</small>
          )}
        </div>

        {/* Available repos from DSI */}
        {availableRepos.length > 0 && (
          <>
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <span className="small fw-bold">Available from DSI</span>
              <span className="text-muted small">
                GitLab ({repoCounts.GitLab}), BitBucket ({repoCounts.BitBucket})
              </span>
            </div>

            <PaginatedTableWrapper
              data={availableRepos}
              itemsPerPage={5}
              itemLabel="repos"
              renderTable={(paginatedData) => (
                <Table bordered hover size="sm">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: '40px' }}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedRepos.length === availableRepos.length && availableRepos.length > 0}
                          onChange={handleSelectAllRepos}
                        />
                      </th>
                      <th>Type</th>
                      <th>Repository Name</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(repo => (
                      <tr key={repo.repoId}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedRepos.includes(repo.repoId)}
                            onChange={() => handleRepoToggle(repo.repoId)}
                          />
                        </td>
                        <td>
                          <Badge bg={repo.type === 'GitLab' ? 'success' : 'primary'}>
                            {repo.type}
                          </Badge>
                        </td>
                        <td>{repo.name}</td>
                        <td>
                          <a href={repo.url} target="_blank" rel="noopener noreferrer">
                            View &rarr;
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            />
          </>
        )}

        {/* Manually added repos */}
        {manualRepos.length > 0 && (
          <>
            <div className="mb-2 mt-3 small fw-bold">Manually Added</div>
            <PaginatedTableWrapper
              data={manualRepos}
              itemsPerPage={5}
              itemLabel="repos"
              renderTable={(paginatedData) => (
                <Table bordered hover size="sm">
                  <thead className="bg-light">
                    <tr>
                      <th>Type</th>
                      <th>Repository Name</th>
                      <th>Link</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(repo => (
                      <tr key={repo.repoId}>
                        <td>
                          <Badge bg={repo.type === 'GitLab' ? 'success' : 'primary'}>
                            {repo.type}
                          </Badge>
                        </td>
                        <td>{repo.name}</td>
                        <td>
                          <a href={repo.url} target="_blank" rel="noopener noreferrer">
                            View &rarr;
                          </a>
                        </td>
                        <td className="text-center align-middle">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-danger"
                            onClick={() => handleRemoveManualRepo(repo.repoId)}
                            title="Remove"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            />
          </>
        )}

        {/* Summary and warnings */}
        <div className="mt-3 mb-2 text-muted small">
          <strong>Total Selected:</strong> {totalSelectedRepos} repositories
        </div>

        {bitbucketSelected && (
          <Alert variant="warning" className="py-2">
            <small>
              <strong>Note:</strong> BitBucket repositories may require migration to GitLab.
            </small>
          </Alert>
        )}

        {totalSelectedRepos === 0 && (
          <Alert variant="danger" className="py-2">
            <small>Please select or add at least one repository to continue.</small>
          </Alert>
        )}

        <RemediationBox
          dataSource="Repository mappings are managed by the DSI team."
          contactEmail="dsi-team@example.com"
          linkUrl="https://dsi.example.com/component-mapping"
          linkText="Open DSI Component Mapping"
        />
      </>
    );
  };

  // Render Step 6: Jira
  const renderJiraStep = () => (
    <>
      {/* Lookup Section */}
      <div className="mb-3 p-3 border rounded bg-light">
        <Form.Label className="small fw-bold">Add Jira Project by Key</Form.Label>
        <InputGroup size="sm">
          <Form.Control
            type="text"
            value={jiraLookupTerm}
            onChange={(e) => setJiraLookupTerm(e.target.value)}
            placeholder="Search by project key or name..."
          />
        </InputGroup>
        {jiraLookupTerm.length >= 2 && jiraLookupResults.length > 0 && (
          <ListGroup className="mt-2" style={{ maxHeight: '150px', overflow: 'auto' }}>
            {jiraLookupResults.map(project => (
              <ListGroup.Item
                key={project.projectKey}
                action
                onClick={() => handleAddJiraFromLookup(project)}
                className="py-2 d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{project.projectKey}</strong> - {project.projectName}
                </div>
                <small className="text-primary">+ Add</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        {jiraLookupTerm.length >= 2 && jiraLookupResults.length === 0 && (
          <small className="text-muted">No Jira projects found</small>
        )}
      </div>

      {/* Available jira from DSI */}
      {availableJira.length > 0 && (
        <>
          <div className="mb-2 d-flex justify-content-between align-items-center">
            <span className="small fw-bold">Available from DSI</span>
            <span className="text-muted small">
              {availableJira.length} projects
            </span>
          </div>

          <PaginatedTableWrapper
            data={availableJira}
            itemsPerPage={5}
            itemLabel="projects"
            renderTable={(paginatedData) => (
              <Table bordered hover size="sm">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '40px' }}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedJira.length === availableJira.length && availableJira.length > 0}
                        onChange={handleSelectAllJira}
                      />
                    </th>
                    <th>Project Name</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(project => (
                    <tr key={project.projectKey}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedJira.includes(project.projectKey)}
                          onChange={() => handleJiraToggle(project.projectKey)}
                        />
                      </td>
                      <td>
                        <strong>{project.projectKey}</strong> - {project.projectName}
                      </td>
                      <td>
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          View Board &rarr;
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          />
        </>
      )}

      {/* Manually added jira */}
      {manualJira.length > 0 && (
        <>
          <div className="mb-2 mt-3 small fw-bold">Manually Added</div>
          <PaginatedTableWrapper
            data={manualJira}
            itemsPerPage={5}
            itemLabel="projects"
            renderTable={(paginatedData) => (
              <Table bordered hover size="sm">
                <thead className="bg-light">
                  <tr>
                    <th>Project Name</th>
                    <th>Link</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(project => (
                    <tr key={project.projectKey}>
                      <td>
                        <strong>{project.projectKey}</strong> - {project.projectName}
                      </td>
                      <td>
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          View Board &rarr;
                        </a>
                      </td>
                      <td className="text-center align-middle">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-danger"
                          onClick={() => handleRemoveManualJira(project.projectKey)}
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          />
        </>
      )}

      {/* Summary */}
      <div className="mt-3 mb-2 text-muted small">
        <strong>Total Selected:</strong> {totalSelectedJira} Jira projects
      </div>

      {totalSelectedJira === 0 && (
        <Alert variant="danger" className="py-2">
          <small>Please select or add at least one Jira project to continue.</small>
        </Alert>
      )}

      <RemediationBox
        dataSource="Jira project mappings are managed by the DSI team."
        contactEmail="dsi-team@example.com"
        linkUrl="https://dsi.example.com/component-mapping"
        linkText="Open DSI Component Mapping"
      />
    </>
  );

  // Render Step 7: Documentation
  const renderDocsStep = () => {
    const availableTypes = getAvailableDocTypes();
    const missingTypes = getMissingDocTypes();

    return (
      <>
        <div className="mb-3 p-3 border rounded bg-light">
          <Form.Label className="small fw-bold">Add Documentation Link</Form.Label>
          <div className="d-flex">
            <Form.Control
              as="select"
              size="sm"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              style={{ width: '200px', marginRight: '0.5rem' }}
            >
              <option value="">Select type...</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Control>
            <Form.Control
              size="sm"
              type="url"
              placeholder="https://confluence.example.com/..."
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              style={{ flex: 1, marginRight: '0.5rem' }}
            />
            <Button
              size="sm"
              variant="primary"
              onClick={handleAddDoc}
              disabled={!docType || !docUrl}
            >
              + Add
            </Button>
          </div>
        </div>

        {addedDocs.length > 0 && (
          <>
            <div className="mb-2 small fw-bold">Added Documents ({addedDocs.length}/{DOC_TYPES.length})</div>
            <PaginatedTableWrapper
              data={addedDocs}
              itemsPerPage={5}
              itemLabel="docs"
              renderTable={(paginatedData) => (
                <Table bordered hover size="sm">
                  <thead className="bg-light">
                    <tr>
                      <th>Document Type</th>
                      <th>URL</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(doc => (
                      <tr key={doc.type}>
                        <td>{doc.type}</td>
                        <td>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-truncate d-block" style={{ maxWidth: '300px' }}>
                            {doc.url}
                          </a>
                        </td>
                        <td className="text-center align-middle">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-danger"
                            onClick={() => handleRemoveDoc(doc.type)}
                            title="Remove"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            />
          </>
        )}

        {missingTypes.length > 0 && (
          <Alert variant="warning" className="py-2">
            <small>
              <strong>Missing:</strong> {missingTypes.join(', ')}
            </small>
          </Alert>
        )}

        {missingTypes.length === 0 && (
          <Alert variant="success" className="py-2">
            <small>All required documents have been added.</small>
          </Alert>
        )}

        <RemediationBox
          dataSource="Documentation is managed in Confluence."
          contactEmail="documentation-team@example.com"
          linkUrl="https://confluence.example.com"
          linkText="Open Confluence"
        />
      </>
    );
  };

  // Render Step 8: Review
  const renderReviewStep = () => {
    const allRepos = getAllSelectedRepos();
    const allJira = getAllSelectedJira();

    return (
      <>
        <Table bordered size="sm">
          <tbody>
            <tr>
              <th style={{ width: '30%' }} className="bg-light">Application</th>
              <td>
                <strong>{selectedApp?.name}</strong>
                <span className="text-muted ms-2">({selectedApp?.cmdbId})</span>
                <span className="text-muted ms-2">- {selectedApp?.tier}</span>
              </td>
            </tr>
            <tr>
              <th className="bg-light">Product</th>
              <td>
                <strong>{selectedProduct?.name}</strong>
              </td>
            </tr>
            <tr>
              <th className="bg-light align-top">Service Instances ({serviceInstances.length})</th>
              <td>
                {serviceInstances.length > 0 ? (
                  serviceInstances.map((si, idx) => (
                    <span key={si.siId}>
                      <Badge bg={getEnvBadgeColor(si.environment)} className="me-1">
                        {si.environment}
                      </Badge>
                      {si.name} <span className="text-muted">({si.siId})</span>
                      {idx < serviceInstances.length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">None</span>
                )}
              </td>
            </tr>
            <tr>
              <th className="bg-light align-top">Repositories ({allRepos.length})</th>
              <td>
                {allRepos.length > 0 ? (
                  allRepos.map((repo, idx) => (
                    <span key={repo.repoId}>
                      <Badge bg={repo.type === 'GitLab' ? 'success' : 'primary'} className="me-1">
                        {repo.type}
                      </Badge>
                      {repo.name}
                      {idx < allRepos.length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">None selected</span>
                )}
              </td>
            </tr>
            <tr>
              <th className="bg-light align-top">Jira Projects ({allJira.length})</th>
              <td>
                {allJira.length > 0 ? (
                  allJira.map((project, idx) => (
                    <span key={project.projectKey}>
                      <strong>{project.projectKey}</strong> - {project.projectName}
                      {idx < allJira.length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">None selected</span>
                )}
              </td>
            </tr>
            <tr>
              <th className="bg-light align-top">Documentation ({addedDocs.length})</th>
              <td>
                {addedDocs.length > 0 ? (
                  addedDocs.map((doc, idx) => (
                    <span key={doc.type}>
                      <strong>{doc.type}</strong>
                      {idx < addedDocs.length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">None added</span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>

        <Alert variant="info" className="small mb-0">
          Review your selections above. Click "Add Application" to complete onboarding.
        </Alert>
      </>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'search':
        return renderSearchStep();
      case 'product':
        return renderProductStep();
      case 'details':
        return renderDetailsStep();
      case 'instances':
        return renderInstancesStep();
      case 'repos':
        return renderReposStep();
      case 'jira':
        return renderJiraStep();
      case 'docs':
        return renderDocsStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  // Check if can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 'product':
        return selectedProduct !== null;
      case 'instances':
        return canProceedFromInstances;
      case 'repos':
        return canProceedFromRepos;
      case 'jira':
        return canProceedFromJira;
      case 'docs':
        return canProceedFromDocs;
      default:
        return true;
    }
  };

  const currentIndex = STEPS.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEPS.length - 1;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {currentStep === 'search' ? 'Search Application' :
           currentStep === 'product' ? 'Select Product' :
           `Add to ${selectedProduct?.name || 'Product'}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: '450px' }}>
        <StepIndicator
          currentStep={currentStep}
          steps={STEPS}
          labels={STEP_LABELS}
          onStepClick={handleStepClick}
        />

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
            {error}
          </Alert>
        )}

        {renderStepContent()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {!isFirstStep && (
          <Button variant="outline-secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        {!isLastStep && currentStep !== 'search' && currentStep !== 'product' && (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
          </Button>
        )}
        {isLastStep && (
          <Button
            variant="success"
            onClick={handleFinish}
          >
            Add Application
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AddAppModal;
