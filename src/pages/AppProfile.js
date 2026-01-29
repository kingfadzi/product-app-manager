import React, { useContext, useState, useEffect } from 'react';
import { Card, Row, Col, Button, Alert, Table, Breadcrumb, Tab, Nav, ListGroup, Modal, Pagination, Form } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import useApps from '../hooks/useApps';
import PageLayout from '../components/layout/PageLayout';
import StepIndicator from '../components/common/StepIndicator';
import { riskStoriesApi, outcomesApi, guildsApi, deploymentsApi } from '../services/api';
import '../styles/tabs.css';

// Contact types
const CONTACT_TYPES = [
  'Product Owner',
  'Architecture Owner',
  'Team Lead',
  'Service Owner'
];

// Format date to short format (e.g., "28 Jan 10:30")
const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' });
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${hours}:${mins}`;
};

function AppProfile() {
  const { id } = useParams();
  const history = useHistory();
  const { apps, products, productApps } = useContext(AppContext);
  const {
    getAppRepos, getAppBacklogs, getAppContacts, getAppDocs,
    createContact, deleteContact, createDoc, deleteDoc
  } = useApps();

  const [repos, setRepos] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [docs, setDocs] = useState([]);
  const [riskStories, setRiskStories] = useState([]);
  const [businessOutcomes, setBusinessOutcomes] = useState([]);
  const [controlSmes, setControlSmes] = useState([]);
  const [fixVersions, setFixVersions] = useState({});
  const [deploymentEnvironments, setDeploymentEnvironments] = useState([]);

  // New contact form state
  const [newContact, setNewContact] = useState({ type: '', name: '', email: '' });
  const [editingContacts, setEditingContacts] = useState(false);

  // Documentation edit mode state
  const [editingDocs, setEditingDocs] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: '', title: '', url: '' });

  // Modal state for list views
  const [showModal, setShowModal] = useState(null); // 'risks' or 'outcomes'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Business Outcome wizard state
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [outcomeViewMode, setOutcomeViewMode] = useState('review'); // 'review' or 'edit'
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    productDeltaDoc: '',
    architectureDeltaDoc: '',
    serviceVisionDeltaDoc: '',
    questionnaire: {
      impactsData: '',
      impactsSecurity: '',
      impactsAccessibility: '',
      requiresArchReview: '',
      deploymentStrategy: ''
    },
    selectedGuilds: []
  });

  const handleOutcomeClick = async (outcome) => {
    setSelectedOutcome(outcome);
    setOutcomeViewMode('review');
    setWizardStep(1);
    // Fetch engagement data from API
    try {
      const response = await fetch(`/api/outcomes/${outcome.id}/engagement`);
      const savedData = await response.json();
      setWizardData({
        productDeltaDoc: savedData.productDeltaDoc || '',
        architectureDeltaDoc: savedData.architectureDeltaDoc || '',
        serviceVisionDeltaDoc: savedData.serviceVisionDeltaDoc || '',
        questionnaire: savedData.questionnaire || {
          impactsData: '',
          impactsSecurity: '',
          impactsAccessibility: '',
          requiresArchReview: '',
          deploymentStrategy: ''
        },
        selectedGuilds: savedData.selectedGuilds || []
      });
    } catch (err) {
      console.error('Error fetching outcome engagement:', err);
      setWizardData({
        productDeltaDoc: '',
        architectureDeltaDoc: '',
        serviceVisionDeltaDoc: '',
        questionnaire: {
          impactsData: '',
          impactsSecurity: '',
          impactsAccessibility: '',
          requiresArchReview: '',
          deploymentStrategy: ''
        },
        selectedGuilds: []
      });
    }
  };

  const saveOutcomeEngagement = async () => {
    if (!selectedOutcome) return;
    try {
      await fetch(`/api/outcomes/${selectedOutcome.id}/engagement`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData)
      });
      setOutcomeViewMode('review');
    } catch (err) {
      console.error('Error saving outcome engagement:', err);
    }
  };

  const startOutcomeEdit = () => {
    setOutcomeViewMode('edit');
    setWizardStep(1);
  };

  const toggleGuild = (guildId) => {
    setWizardData(prev => ({
      ...prev,
      selectedGuilds: prev.selectedGuilds.includes(guildId)
        ? prev.selectedGuilds.filter(id => id !== guildId)
        : [...prev.selectedGuilds, guildId]
    }));
  };

  const allGuilds = [
    { id: 'data', name: 'Data', color: '#ffc107' },
    { id: 'security', name: 'Security', color: '#dc3545' },
    { id: 'accessibility', name: 'Accessibility', color: '#007bff' },
    { id: 'ent-arch', name: 'Ent. Architecture', color: '#6f42c1' },
    { id: 'srv-transition', name: 'Srv. Transition', color: '#28a745' }
  ];

  // Deployment wizard state
  const [showDeploymentWizard, setShowDeploymentWizard] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(1);
  const [deploymentData, setDeploymentData] = useState({
    selectedBacklog: null,
    selectedVersion: null,
    navigatorId: '',
    environments: [],
    attestations: {
      codeReviewed: false,
      testsPass: false,
      securityScan: false,
      documentationUpdated: false,
      rollbackPlan: false
    }
  });

  const openDeploymentWizard = () => {
    setShowDeploymentWizard(true);
    setDeploymentStep(1);
    setDeploymentData({
      selectedBacklog: null,
      selectedVersion: null,
      navigatorId: '',
      environments: [],
      attestations: {
        codeReviewed: false,
        testsPass: false,
        securityScan: false,
        documentationUpdated: false,
        rollbackPlan: false
      }
    });
  };

  const toggleAttestation = (key) => {
    setDeploymentData(prev => ({
      ...prev,
      attestations: {
        ...prev.attestations,
        [key]: !prev.attestations[key]
      }
    }));
  };

  const allAttestationsChecked = () => {
    return Object.values(deploymentData.attestations).every(v => v === true);
  };

  const closeDeploymentWizard = () => {
    setShowDeploymentWizard(false);
    setDeploymentStep(1);
  };

  const toggleEnvironment = (envId) => {
    setDeploymentData(prev => ({
      ...prev,
      environments: prev.environments.includes(envId)
        ? prev.environments.filter(id => id !== envId)
        : [...prev.environments, envId]
    }));
  };

  const getFixVersionsForBacklog = () => {
    if (!deploymentData.selectedBacklog) return [];
    return fixVersions[deploymentData.selectedBacklog.projectKey] || [];
  };

  const loadFixVersions = async (projectKey) => {
    try {
      const versions = await deploymentsApi.getFixVersions(projectKey);
      setFixVersions(prev => ({ ...prev, [projectKey]: versions }));
    } catch (err) {
      console.error('Error loading fix versions:', err);
    }
  };

  const closeOutcomeWizard = () => {
    setSelectedOutcome(null);
    setOutcomeViewMode('review');
    setWizardStep(1);
  };

  const cancelOutcomeEdit = () => {
    setOutcomeViewMode('review');
    setWizardStep(1);
  };

  // Contact management functions
  const addContact = async () => {
    if (newContact.type && newContact.name && newContact.email) {
      const contactData = {
        role: newContact.type,
        name: newContact.name,
        email: newContact.email
      };
      const created = await createContact(id, contactData);
      setContacts([...contacts, created]);
      setNewContact({ type: '', name: '', email: '' });
    }
  };

  const removeContact = async (contactId) => {
    await deleteContact(contactId);
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  // Documentation management functions
  const addDoc = async () => {
    if (newDoc.type && newDoc.title && newDoc.url) {
      const docData = {
        type: newDoc.type,
        title: newDoc.title,
        url: newDoc.url
      };
      const created = await createDoc(id, docData);
      setDocs([...docs, created]);
      setNewDoc({ type: '', title: '', url: '' });
    }
  };

  const removeDoc = async (docId) => {
    await deleteDoc(docId);
    setDocs(docs.filter(d => d.id !== docId));
  };

  const app = apps.find(a => a.id === id);

  // Find products this app belongs to
  const appProductIds = productApps
    .filter(pa => pa.appId === id)
    .map(pa => pa.productId);
  const appProducts = products.filter(p => appProductIds.includes(p.id));

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [reposData, backlogsData, contactsData, docsData, riskData, outcomesData, smesData, envsData] = await Promise.all([
        getAppRepos(id),
        getAppBacklogs(id),
        getAppContacts(id),
        getAppDocs(id),
        riskStoriesApi.getByApp(id),
        outcomesApi.getByApp(id),
        guildsApi.getByApp(id),
        deploymentsApi.getEnvironments(),
      ]);
      setRepos(reposData || []);
      setBacklogs(backlogsData || []);
      setContacts(contactsData || []);
      setDocs(docsData || []);
      setRiskStories(riskData || []);
      setBusinessOutcomes(outcomesData || []);
      setControlSmes(smesData || []);
      setDeploymentEnvironments(envsData || []);
    } catch (err) {
      console.error('Error loading app data:', err);
    }
  };

  if (!app) {
    return (
      <PageLayout>
        <Alert variant="warning">
          App not found.{' '}
          <Button variant="link" onClick={() => history.push('/apps')}>
            Back to Apps
          </Button>
        </Alert>
      </PageLayout>
    );
  }

  const roleLabels = {
    product_owner: 'Product Owner',
    tech_lead: 'Tech Lead',
    business_owner: 'Business Owner',
    sme: 'SME',
  };

  // Get initial letter for avatar
  const initial = app.name.charAt(0).toUpperCase();

  return (
    <PageLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        {appProducts.length > 0 ? (
          <Breadcrumb.Item onClick={() => history.push(`/products/${appProducts[0].id}`)}>
            {appProducts[0].name}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item onClick={() => history.push('/apps')}>Applications</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>{app.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* App Header */}
      <div className="d-flex align-items-center mb-4">
        <div
          className="d-flex align-items-center justify-content-center mr-3"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#00b894',
            borderRadius: '8px',
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          {initial}
        </div>
        <div className="flex-grow-1">
          <h2 className="mb-1">{app.name}</h2>
          <div className="text-muted">
            <span className="mr-3">{app.cmdbId}</span>
            {app.parent && <span className="mr-3">Parent: {app.parent}</span>}
            {app.resCat && <span className="mr-3">ResCat: {app.resCat}</span>}
          </div>
        </div>
      </div>

      <Row>
        {/* Left Column */}
        <Col lg={6}>
          {/* Application Details Card with Tabs */}
          <Card className="mb-4 tabbed-card">
            <Tab.Container defaultActiveKey="overview">
              <Card.Header>
                <strong>Application Details</strong>
                <Nav variant="tabs" className="mt-2">
                  <Nav.Item>
                    <Nav.Link eventKey="overview">Overview</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="contacts">Contacts</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="products">Products</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  {/* Overview Tab */}
                  <Tab.Pane eventKey="overview">
                    <Row>
                      <Col xs={6}>
                        <div className="mb-1 d-flex">
                          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>App ID</span>
                          <span>{app.cmdbId}</span>
                        </div>
                        <div className="mb-1 d-flex">
                          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Owner</span>
                          <span>{app.productOwner || '-'}</span>
                        </div>
                        <div className="mb-1 d-flex">
                          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Tier</span>
                          <span>{app.tier || '-'}</span>
                        </div>
                        <div className="mb-1 d-flex">
                          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Status</span>
                          <span>{app.operationalStatus || '-'}</span>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="mb-1 d-flex">
                          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Name</span>
                          <span>{app.name}</span>
                        </div>
                        <div className="mb-1 d-flex">
                          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Architect</span>
                          <span>{app.systemArchitect || '-'}</span>
                        </div>
                        <div className="mb-1 d-flex align-items-center">
                          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Res. Category</span>
                          {app.resCat ? (
                            <span className={`badge bg-${app.resCat === 'Critical' ? 'danger' : app.resCat === 'High' ? 'warning' : app.resCat === 'Medium' ? 'info' : 'secondary'}`}>
                              {app.resCat}
                            </span>
                          ) : '-'}
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Contacts Tab */}
                  <Tab.Pane eventKey="contacts">
                    {/* Edit Button */}
                    <div className="d-flex justify-content-end mb-2">
                      <Button
                        variant={editingContacts ? "outline-secondary" : "outline-primary"}
                        size="sm"
                        onClick={() => { setEditingContacts(!editingContacts); setNewContact({ type: '', name: '', email: '' }); }}
                      >
                        {editingContacts ? 'Done' : 'Edit'}
                      </Button>
                    </div>

                    {/* Contacts List */}
                    {contacts.length === 0 ? (
                      <p className="text-muted mb-0">No contacts added</p>
                    ) : (
                      <Table size="sm" className={editingContacts ? "mb-3" : "mb-0"} borderless>
                        <tbody>
                          {contacts.map(contact => (
                            <tr key={contact.id}>
                              <td style={{ whiteSpace: 'nowrap' }} className="text-muted">{contact.role}</td>
                              <td>{contact.name}</td>
                              <td>{contact.email}</td>
                              {editingContacts && (
                                <td style={{ width: '30px' }} className="text-center align-middle">
                                  <button
                                    type="button"
                                    onClick={() => removeContact(contact.id)}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#dc3545' }}
                                    title="Remove contact"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}

                    {/* Add Contact Form - only in edit mode */}
                    {editingContacts && (
                      <div className="d-flex" style={{ gap: '0.5rem' }}>
                        <Form.Control
                          as="select"
                          size="sm"
                          value={newContact.type}
                          onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                          style={{ width: '140px' }}
                        >
                          <option value="">Type...</option>
                          {CONTACT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Form.Control>
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="Name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          style={{ flex: 1 }}
                        />
                        <Form.Control
                          type="email"
                          size="sm"
                          placeholder="Email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          style={{ flex: 1 }}
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={addContact}
                          disabled={!newContact.type || !newContact.name || !newContact.email}
                        >
                          + Add
                        </Button>
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Products Tab */}
                  <Tab.Pane eventKey="products">
                    {appProducts.length === 0 ? (
                      <p className="text-muted mb-0">Not assigned to any products</p>
                    ) : (
                      <ListGroup variant="flush">
                        {appProducts.map(product => (
                          <ListGroup.Item
                            key={product.id}
                            action
                            onClick={() => history.push(`/products/${product.id}`)}
                            className="px-0"
                          >
                            {product.name}
                            <span className="text-muted ml-2">({product.stack})</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>

          {/* Documentation Card */}
          <Card className="mb-4 tabbed-card">
            <Tab.Container defaultActiveKey="product">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Documentation</strong>
                  <Button
                    variant={editingDocs ? "outline-secondary" : "outline-primary"}
                    size="sm"
                    onClick={() => { setEditingDocs(!editingDocs); setNewDoc({ type: '', title: '', url: '' }); }}
                  >
                    {editingDocs ? 'Done' : 'Edit'}
                  </Button>
                </div>
                <Nav variant="tabs" className="mt-2">
                  <Nav.Item>
                    <Nav.Link eventKey="product">Product</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="technical">Technical</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  {/* Product Tab */}
                  <Tab.Pane eventKey="product">
                    {(() => {
                      const productDocTypes = ['Product Vision', 'Product Roadmap'];
                      const productDocs = docs.filter(d => productDocTypes.includes(d.type));
                      const existingProductTypes = productDocs.map(d => d.type);
                      const availableProductTypes = productDocTypes.filter(t => !existingProductTypes.includes(t));
                      return (
                        <>
                          {productDocs.length === 0 ? (
                            <p className="text-muted mb-0">No product documentation added</p>
                          ) : (
                            <Table size="sm" className={editingDocs ? "mb-3" : "mb-0"} borderless>
                              <tbody>
                                {productDocs.map(doc => (
                                  <tr key={doc.id}>
                                    <td style={{ whiteSpace: 'nowrap' }} className="text-muted">{doc.type}</td>
                                    <td>
                                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                        {doc.title} &rarr;
                                      </a>
                                    </td>
                                    {editingDocs && (
                                      <td style={{ width: '30px' }} className="text-center align-middle">
                                        <button
                                          type="button"
                                          onClick={() => removeDoc(doc.id)}
                                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#dc3545' }}
                                          title="Remove document"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                          </svg>
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          )}
                          {editingDocs && availableProductTypes.length > 0 && (
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                              <Form.Control
                                as="select"
                                size="sm"
                                value={availableProductTypes.includes(newDoc.type) ? newDoc.type : ''}
                                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                                style={{ width: '140px' }}
                              >
                                <option value="">Type...</option>
                                {availableProductTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </Form.Control>
                              <Form.Control
                                type="text"
                                size="sm"
                                placeholder="Title"
                                value={availableProductTypes.includes(newDoc.type) || !newDoc.type ? newDoc.title : ''}
                                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                                style={{ flex: 1 }}
                              />
                              <Form.Control
                                type="url"
                                size="sm"
                                placeholder="URL"
                                value={availableProductTypes.includes(newDoc.type) || !newDoc.type ? newDoc.url : ''}
                                onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                                style={{ flex: 1 }}
                              />
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={addDoc}
                                disabled={!availableProductTypes.includes(newDoc.type) || !newDoc.title || !newDoc.url}
                              >
                                + Add
                              </Button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </Tab.Pane>

                  {/* Technical Tab */}
                  <Tab.Pane eventKey="technical">
                    {(() => {
                      const techDocTypes = ['Architecture Vision', 'Service Vision', 'Security Vision', 'Test Strategy'];
                      const techDocs = docs.filter(d => techDocTypes.includes(d.type));
                      const existingTechTypes = techDocs.map(d => d.type);
                      const availableTechTypes = techDocTypes.filter(t => !existingTechTypes.includes(t));
                      return (
                        <>
                          {techDocs.length === 0 ? (
                            <p className="text-muted mb-0">No technical documentation added</p>
                          ) : (
                            <Table size="sm" className={editingDocs ? "mb-3" : "mb-0"} borderless>
                              <tbody>
                                {techDocs.map(doc => (
                                  <tr key={doc.id}>
                                    <td style={{ whiteSpace: 'nowrap' }} className="text-muted">{doc.type}</td>
                                    <td>
                                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                        {doc.title} &rarr;
                                      </a>
                                    </td>
                                    {editingDocs && (
                                      <td style={{ width: '30px' }} className="text-center align-middle">
                                        <button
                                          type="button"
                                          onClick={() => removeDoc(doc.id)}
                                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#dc3545' }}
                                          title="Remove document"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                          </svg>
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          )}
                          {editingDocs && availableTechTypes.length > 0 && (
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                              <Form.Control
                                as="select"
                                size="sm"
                                value={availableTechTypes.includes(newDoc.type) ? newDoc.type : ''}
                                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                                style={{ width: '150px' }}
                              >
                                <option value="">Type...</option>
                                {availableTechTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </Form.Control>
                              <Form.Control
                                type="text"
                                size="sm"
                                placeholder="Title"
                                value={availableTechTypes.includes(newDoc.type) || !newDoc.type ? newDoc.title : ''}
                                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                                style={{ flex: 1 }}
                              />
                              <Form.Control
                                type="url"
                                size="sm"
                                placeholder="URL"
                                value={availableTechTypes.includes(newDoc.type) || !newDoc.type ? newDoc.url : ''}
                                onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                                style={{ flex: 1 }}
                              />
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={addDoc}
                                disabled={!availableTechTypes.includes(newDoc.type) || !newDoc.title || !newDoc.url}
                              >
                                + Add
                              </Button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>
        </Col>

        {/* Right Column */}
        <Col lg={6}>
          {/* Governance & Controls Card with Tabs */}
          <Card className="mb-4 tabbed-card">
            <Tab.Container defaultActiveKey="outcomes">
              <Card.Header>
                <strong>Governance & Controls</strong>
                <Nav variant="tabs" className="mt-2">
                  <Nav.Item>
                    <Nav.Link eventKey="outcomes">Business Outcomes</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="risk">Risk Stories</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="guilds">Guilds</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="audit">Audit Log</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  {/* Business Outcomes Tab */}
                  <Tab.Pane eventKey="outcomes">
                    <Table size="sm" className="mb-0" borderless>
                      <tbody>
                        {businessOutcomes.slice(0, 2).map(item => (
                          <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => handleOutcomeClick(item)}>
                            <td>
                              <span className="text-primary">{item.id}</span>
                            </td>
                            <td>{item.summary}</td>
                            <td className="text-muted">{item.status}</td>
                            <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatShortDate(item.updated)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="p-0" onClick={() => { setShowModal('outcomes'); setCurrentPage(1); }}>
                        View more →
                      </Button>
                    </div>
                  </Tab.Pane>

                  {/* Risk Stories Tab */}
                  <Tab.Pane eventKey="risk">
                    <Table size="sm" className="mb-0" borderless>
                      <tbody>
                        {riskStories.slice(0, 2).map(item => (
                          <tr key={item.id}>
                            <td>
                              <a href={`https://jira.example.com/browse/${item.id}`} target="_blank" rel="noopener noreferrer">
                                {item.id}
                              </a>
                            </td>
                            <td>{item.summary}</td>
                            <td className="text-muted">{item.status}</td>
                            <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatShortDate(item.updated)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="text-right mt-2">
                      <Button variant="link" size="sm" className="p-0" onClick={() => { setShowModal('risks'); setCurrentPage(1); }}>
                        View more →
                      </Button>
                    </div>
                  </Tab.Pane>

                  {/* Guilds Tab */}
                  <Tab.Pane eventKey="guilds">
                    {controlSmes.length === 0 ? (
                      <p className="text-muted mb-0">No control SMEs assigned</p>
                    ) : (
                      <Table size="sm" className="mb-0" borderless>
                        <tbody>
                          {controlSmes.map(sme => (
                            <tr key={sme.id}>
                              <td>
                                <a href={`mailto:${sme.email}`}>{sme.name}</a>
                              </td>
                              <td>{sme.guild}</td>
                              <td style={{ width: '30px', textAlign: 'center' }}>
                                <span
                                  title={sme.health}
                                  style={{
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: sme.health === 'Green' ? '#28a745' : sme.health === 'Amber' ? '#ffc107' : '#dc3545'
                                  }}
                                ></span>
                              </td>
                              <td style={{ width: '30px', textAlign: 'center' }}>
                                {sme.blocked ? (
                                  <span title="Blocked" style={{ color: '#dc3545' }}>&#x26D4;</span>
                                ) : (
                                  <span title="Not blocked" style={{ color: '#28a745' }}>&#x2713;</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Tab.Pane>

                  {/* Audit Log Tab */}
                  <Tab.Pane eventKey="audit">
                    <p className="text-muted mb-0">No audit entries available</p>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>

          {/* Deployments Card with Tabs */}
          <Card className="mb-4 tabbed-card">
            <Tab.Container defaultActiveKey="releases">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Deployments</strong>
                  <Button variant="dark" size="sm" onClick={openDeploymentWizard}>+ Create</Button>
                </div>
                <Nav variant="tabs" className="mt-2">
                  <Nav.Item>
                    <Nav.Link eventKey="releases">Releases</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="history">History</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="crs">CRs</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  {/* Releases Tab */}
                  <Tab.Pane eventKey="releases">
                    <p className="text-muted mb-0">No active releases</p>
                  </Tab.Pane>

                  {/* History Tab */}
                  <Tab.Pane eventKey="history">
                    <p className="text-muted mb-0">No deployment history available</p>
                  </Tab.Pane>

                  {/* Change Requests Tab */}
                  <Tab.Pane eventKey="crs">
                    <p className="text-muted mb-0">No change requests available</p>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>

          {/* Source Code & Backlogs Card with Tabs */}
          <Card className="mb-4 tabbed-card">
            <Tab.Container defaultActiveKey="repos">
              <Card.Header>
                <strong>Source Code & Backlogs</strong>
                <Nav variant="tabs" className="mt-2">
                  <Nav.Item>
                    <Nav.Link eventKey="repos">Repositories</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="jira">Backlogs</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  {/* Repositories Tab */}
                  <Tab.Pane eventKey="repos">
                    {repos.length === 0 ? (
                      <p className="text-muted mb-0">No repositories added</p>
                    ) : (
                      <Table size="sm" className="mb-0" borderless>
                        <tbody>
                          {repos.map(repo => (
                            <tr key={repo.id}>
                              <td>
                                <a href={`https://gitlab.com/${repo.repoPath}`} target="_blank" rel="noopener noreferrer">
                                  {repo.repoName}
                                </a>
                              </td>
                              <td>{repo.role}</td>
                              <td className="text-muted">{repo.platform || 'GitLab'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Tab.Pane>

                  {/* Backlogs Tab */}
                  <Tab.Pane eventKey="jira">
                    {backlogs.length === 0 ? (
                      <p className="text-muted mb-0">No backlogs added</p>
                    ) : (
                      <Table size="sm" className="mb-0" borderless>
                        <tbody>
                          {backlogs.map(backlog => (
                            <tr key={backlog.id}>
                              <td>
                                <a href={`https://jira.example.com/browse/${backlog.projectKey}`} target="_blank" rel="noopener noreferrer">
                                  {backlog.projectKey}
                                </a>
                              </td>
                              <td>{backlog.projectName}</td>
                              <td className="text-muted">{backlog.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>
        </Col>
      </Row>

      {/* Modal for Risk Stories / Business Outcomes */}
      <Modal show={!!showModal} onHide={() => setShowModal(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {showModal === 'risks' ? 'Risk Stories' : 'Business Outcomes'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(() => {
            const data = showModal === 'risks' ? riskStories : businessOutcomes;
            const totalPages = Math.ceil(data.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

            return (
              <>
                <Table size="sm" borderless>
                  <tbody>
                    {paginatedData.map(item => (
                      <tr
                        key={item.id}
                        style={showModal === 'outcomes' ? { cursor: 'pointer' } : {}}
                        onClick={showModal === 'outcomes' ? () => { setShowModal(null); handleOutcomeClick(item); } : undefined}
                      >
                        <td style={{ width: '100px' }}>
                          {showModal === 'risks' ? (
                            <a href={`https://jira.example.com/browse/${item.id}`} target="_blank" rel="noopener noreferrer">
                              {item.id}
                            </a>
                          ) : (
                            <span className="text-primary">{item.id}</span>
                          )}
                        </td>
                        <td>{item.summary}</td>
                        <td className="text-muted" style={{ width: '100px' }}>{item.status}</td>
                        <td className="text-muted" style={{ width: '120px', whiteSpace: 'nowrap' }}>{formatShortDate(item.updated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination size="sm">
                      <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            );
          })()}
        </Modal.Body>
      </Modal>

      {/* Business Outcome Modal - Review & Edit Modes */}
      <Modal show={!!selectedOutcome} onHide={closeOutcomeWizard} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingRight: '1rem' }}>
            <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>
              {selectedOutcome?.id} - {selectedOutcome?.summary}
            </Modal.Title>
            {outcomeViewMode === 'review' && (
              <Button variant="outline-primary" size="sm" onClick={startOutcomeEdit}>
                Edit
              </Button>
            )}
          </div>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: '0.5rem' }}>
          {/* REVIEW MODE */}
          {outcomeViewMode === 'review' && selectedOutcome && (
            <div>
              {/* Details Card */}
              <Card className="mb-3">
                <Card.Header style={{ background: 'none' }}>
                  <strong>Details</strong>
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0" borderless>
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: '120px', whiteSpace: 'nowrap' }}>Fix Release</td>
                        <td>{selectedOutcome.fixRelease}</td>
                        <td className="text-muted" style={{ width: '120px', whiteSpace: 'nowrap' }}>Status</td>
                        <td>{selectedOutcome.status}</td>
                      </tr>
                      <tr>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Portfolio EPV</td>
                        <td>{selectedOutcome.portfolioEpv}</td>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Navigator ID</td>
                        <td>{selectedOutcome.navigatorId}</td>
                      </tr>
                      <tr>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Description</td>
                        <td colSpan={3}>{selectedOutcome.description}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Delta Documentation Card */}
              <Card className="mb-3">
                <Card.Header style={{ background: 'none' }}>
                  <strong>Delta Documentation</strong>
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0" borderless>
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: '150px', whiteSpace: 'nowrap' }}>Product Delta</td>
                        <td>
                          {wizardData.productDeltaDoc ? (
                            <a href={wizardData.productDeltaDoc} target="_blank" rel="noopener noreferrer">View Document &rarr;</a>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Architecture Delta</td>
                        <td>
                          {wizardData.architectureDeltaDoc ? (
                            <a href={wizardData.architectureDeltaDoc} target="_blank" rel="noopener noreferrer">View Document &rarr;</a>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Service Vision Delta</td>
                        <td>
                          {wizardData.serviceVisionDeltaDoc ? (
                            <a href={wizardData.serviceVisionDeltaDoc} target="_blank" rel="noopener noreferrer">View Document &rarr;</a>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Guild Engagement Card */}
              <Card className="mb-3">
                <Card.Header style={{ background: 'none' }}>
                  <strong>Guild Engagement Assessment</strong>
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0" borderless>
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: '150px', whiteSpace: 'nowrap' }}>Impacts Data</td>
                        <td>{wizardData.questionnaire.impactsData === 'yes' ? 'Yes' : wizardData.questionnaire.impactsData === 'no' ? 'No' : '—'}</td>
                        <td className="text-muted" style={{ width: '150px', whiteSpace: 'nowrap' }}>Arch Review</td>
                        <td>{wizardData.questionnaire.requiresArchReview === 'yes' ? 'Yes' : wizardData.questionnaire.requiresArchReview === 'no' ? 'No' : '—'}</td>
                      </tr>
                      <tr>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Impacts Security</td>
                        <td>{wizardData.questionnaire.impactsSecurity === 'yes' ? 'Yes' : wizardData.questionnaire.impactsSecurity === 'no' ? 'No' : '—'}</td>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Deploy Strategy</td>
                        <td>
                          {wizardData.questionnaire.deploymentStrategy === 'standard' ? 'Standard Release' :
                           wizardData.questionnaire.deploymentStrategy === 'hotfix' ? 'Hotfix' :
                           wizardData.questionnaire.deploymentStrategy === 'feature-flag' ? 'Feature Flag' : '—'}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>Impacts Accessibility</td>
                        <td>{wizardData.questionnaire.impactsAccessibility === 'yes' ? 'Yes' : wizardData.questionnaire.impactsAccessibility === 'no' ? 'No' : '—'}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Assigned Guilds Card */}
              <Card>
                <Card.Header style={{ background: 'none' }}>
                  <strong>Assigned Guilds</strong>
                </Card.Header>
                <Card.Body>
                  {wizardData.selectedGuilds.length === 0 ? (
                    <p className="text-muted mb-0">No guilds assigned</p>
                  ) : (
                    <Table size="sm" className="mb-0" borderless>
                      <tbody>
                        {controlSmes.filter(sme => wizardData.selectedGuilds.includes(sme.id)).map(sme => (
                          <tr key={sme.id}>
                            <td>
                              <a href={`mailto:${sme.email}`}>{sme.name}</a>
                            </td>
                            <td>{sme.guild}</td>
                            <td style={{ width: '30px', textAlign: 'center' }}>
                              <span
                                title={sme.health}
                                style={{
                                  display: 'inline-block',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: sme.health === 'Green' ? '#28a745' : sme.health === 'Amber' ? '#ffc107' : '#dc3545'
                                }}
                              ></span>
                            </td>
                            <td style={{ width: '30px', textAlign: 'center' }}>
                              {sme.blocked ? (
                                <span title="Blocked" style={{ color: '#dc3545' }}>&#x26D4;</span>
                              ) : (
                                <span title="Not blocked" style={{ color: '#28a745' }}>&#x2713;</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}

          {/* EDIT MODE - Wizard Steps */}
          {outcomeViewMode === 'edit' && (
            <>
              <StepIndicator steps={['Details', 'Changes', 'Questionnaire', 'Request']} currentStep={wizardStep} />

              {/* Step 1: Business Outcome Details */}
              {wizardStep === 1 && selectedOutcome && (
                <div>
                  <h6 className="mb-3">Business Outcome Details</h6>
                  <table className="table table-sm table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: '140px' }}>Fix Release</td>
                        <td>{selectedOutcome.fixRelease}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Description</td>
                        <td>{selectedOutcome.description}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Portfolio EPV</td>
                        <td>{selectedOutcome.portfolioEpv}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Navigator ID</td>
                        <td>{selectedOutcome.navigatorId}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Step 2: Add Changes to Application */}
              {wizardStep === 2 && (
                <div>
                  <h6 className="mb-3">Add Changes to Application</h6>
                  <p className="text-muted small">Add delta documentation links for this change.</p>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Delta Doc</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://confluence.example.com/..."
                      value={wizardData.productDeltaDoc}
                      onChange={(e) => setWizardData({ ...wizardData, productDeltaDoc: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Architecture Delta Doc</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://confluence.example.com/..."
                      value={wizardData.architectureDeltaDoc}
                      onChange={(e) => setWizardData({ ...wizardData, architectureDeltaDoc: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Service Vision Delta Doc</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://confluence.example.com/..."
                      value={wizardData.serviceVisionDeltaDoc}
                      onChange={(e) => setWizardData({ ...wizardData, serviceVisionDeltaDoc: e.target.value })}
                    />
                  </Form.Group>
                </div>
              )}

              {/* Step 3: Guild Engagement Questionnaire */}
              {wizardStep === 3 && (
                <div>
                  <h6 className="mb-3">Guild Engagement Questionnaire</h6>
                  <p className="text-muted small">Answer the following to determine required guild engagements.</p>
                  <Form.Group className="mb-3">
                    <Form.Label>Does this change impact data architecture?</Form.Label>
                    <Form.Control
                      as="select"
                      value={wizardData.questionnaire.impactsData}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        questionnaire: { ...wizardData.questionnaire, impactsData: e.target.value }
                      })}
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Does this change have security implications?</Form.Label>
                    <Form.Control
                      as="select"
                      value={wizardData.questionnaire.impactsSecurity}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        questionnaire: { ...wizardData.questionnaire, impactsSecurity: e.target.value }
                      })}
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Does this change impact accessibility?</Form.Label>
                    <Form.Control
                      as="select"
                      value={wizardData.questionnaire.impactsAccessibility}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        questionnaire: { ...wizardData.questionnaire, impactsAccessibility: e.target.value }
                      })}
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Does this require architecture review?</Form.Label>
                    <Form.Control
                      as="select"
                      value={wizardData.questionnaire.requiresArchReview}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        questionnaire: { ...wizardData.questionnaire, requiresArchReview: e.target.value }
                      })}
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Deployment strategy</Form.Label>
                    <Form.Control
                      as="select"
                      value={wizardData.questionnaire.deploymentStrategy}
                      onChange={(e) => setWizardData({
                        ...wizardData,
                        questionnaire: { ...wizardData.questionnaire, deploymentStrategy: e.target.value }
                      })}
                    >
                      <option value="">Select...</option>
                      <option value="standard">Standard Release</option>
                      <option value="hotfix">Hotfix</option>
                      <option value="feature-flag">Feature Flag</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              )}

              {/* Step 4: Request Guild Engagement */}
              {wizardStep === 4 && (
                <div>
                  <h6 className="mb-3">Request Guild Engagement</h6>
                  <p className="text-muted small">Select the guild members you want to engage with:</p>
                  {controlSmes.map(sme => {
                    const isRecommended =
                      (sme.guild === 'Data' && wizardData.questionnaire.impactsData === 'yes') ||
                      (sme.guild === 'Security' && wizardData.questionnaire.impactsSecurity === 'yes') ||
                      (sme.guild === 'Accessibility' && wizardData.questionnaire.impactsAccessibility === 'yes') ||
                      (sme.guild === 'Ent. Architecture' && wizardData.questionnaire.requiresArchReview === 'yes') ||
                      (sme.guild === 'Srv. Transition' && wizardData.questionnaire.deploymentStrategy);

                    return (
                      <Form.Check
                        key={sme.id}
                        type="checkbox"
                        id={`sme-${sme.id}`}
                        className="mb-2"
                        checked={wizardData.selectedGuilds.includes(sme.id)}
                        onChange={() => toggleGuild(sme.id)}
                        label={
                          <span>
                            {sme.name} <span className="text-muted">({sme.guild})</span>
                            {isRecommended && <span className="text-success ml-2" style={{ fontSize: '12px' }}>(Recommended)</span>}
                          </span>
                        }
                      />
                    );
                  })}
                  {wizardData.selectedGuilds.length > 0 && (
                    <Alert variant="info" className="mt-3">
                      Click "Submit Request" to notify {wizardData.selectedGuilds.length} guild member(s) and create engagement tickets.
                    </Alert>
                  )}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-between' }}>
          {/* REVIEW MODE Footer */}
          {outcomeViewMode === 'review' && (
            <>
              <div />
              <Button variant="secondary" onClick={closeOutcomeWizard} style={{ fontSize: '0.875rem' }}>
                Close
              </Button>
            </>
          )}

          {/* EDIT MODE Footer */}
          {outcomeViewMode === 'edit' && (
            <>
              {wizardStep > 1 ? (
                <Button variant="outline-secondary" onClick={() => setWizardStep(wizardStep - 1)} style={{ fontSize: '0.875rem' }}>
                  ← Back
                </Button>
              ) : (
                <div />
              )}
              <div>
                <Button variant="secondary" onClick={cancelOutcomeEdit} className="mr-2" style={{ fontSize: '0.875rem' }}>
                  Cancel
                </Button>
                {wizardStep < 4 ? (
                  <Button variant="dark" onClick={() => setWizardStep(wizardStep + 1)} style={{ fontSize: '0.875rem' }}>
                    Next →
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={saveOutcomeEngagement}
                    style={{ fontSize: '0.875rem' }}
                    disabled={wizardData.selectedGuilds.length === 0}
                  >
                    Submit Request
                  </Button>
                )}
              </div>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Create Deployment Wizard Modal */}
      <Modal show={showDeploymentWizard} onHide={closeDeploymentWizard} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>Create New Release</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0 }}>
          <StepIndicator steps={['Project', 'Version', 'Details', 'Environments', 'Attestation']} currentStep={deploymentStep} />

          {/* Step 1: Select Jira Project (Backlog) */}
          {deploymentStep === 1 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Select Jira Project</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Choose the Jira project that contains the backlog for this release.
              </p>
              {backlogs.length === 0 ? (
                <Alert variant="warning" style={{ fontSize: '0.8125rem' }}>
                  No backlogs linked to this application. Please add a backlog first.
                </Alert>
              ) : (
                <>
                  <Form.Control
                    as="select"
                    value={deploymentData.selectedBacklog?.projectKey || ''}
                    onChange={(e) => {
                      const backlog = backlogs.find(b => b.projectKey === e.target.value);
                      setDeploymentData({ ...deploymentData, selectedBacklog: backlog, selectedVersion: null });
                    }}
                    style={{ fontSize: '0.875rem' }}
                  >
                    <option value="">Select a project...</option>
                    {backlogs.map(backlog => (
                      <option key={backlog.id} value={backlog.projectKey}>
                        {backlog.projectKey} - {backlog.projectName}
                      </option>
                    ))}
                  </Form.Control>
                  {deploymentData.selectedBacklog && (
                    <Alert variant="light" className="mt-3" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6' }}>
                      <strong>{deploymentData.selectedBacklog.projectKey}</strong> - {deploymentData.selectedBacklog.projectName}
                      <br />
                      <small className="text-muted">Purpose: {deploymentData.selectedBacklog.purpose}</small>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 2: Select Fix Version */}
          {deploymentStep === 2 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Select Fix Version</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Choose the Jira Fix Version that contains the features for this release.
              </p>
              {getFixVersionsForBacklog().length === 0 ? (
                <Alert variant="warning" style={{ fontSize: '0.8125rem' }}>
                  No fix versions found for {deploymentData.selectedBacklog?.projectKey}.
                </Alert>
              ) : (
                <>
                  <Form.Control
                    as="select"
                    value={deploymentData.selectedVersion?.id || ''}
                    onChange={(e) => {
                      const version = getFixVersionsForBacklog().find(v => v.id === e.target.value);
                      setDeploymentData({ ...deploymentData, selectedVersion: version });
                    }}
                    style={{ fontSize: '0.875rem' }}
                  >
                    <option value="">Select a version...</option>
                    {getFixVersionsForBacklog().map(version => (
                      <option key={version.id} value={version.id}>
                        {version.name} ({version.status})
                      </option>
                    ))}
                  </Form.Control>
                  {deploymentData.selectedVersion && (
                    <Alert variant="light" className="mt-3" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6' }}>
                      <strong>{deploymentData.selectedVersion.name}</strong>
                      <br />
                      <small className="text-muted">
                        Release Date: {deploymentData.selectedVersion.releaseDate} |
                        Issues: {deploymentData.selectedVersion.issueCount} |
                        Status: {deploymentData.selectedVersion.status}
                      </small>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Release Details */}
          {deploymentStep === 3 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Release Details</h6>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  Navigator ID <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. NAV-12345, EPIC-789"
                  value={deploymentData.navigatorId}
                  onChange={(e) => setDeploymentData({ ...deploymentData, navigatorId: e.target.value })}
                  style={{ fontSize: '0.875rem' }}
                />
                <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Link to Navigator planning system or tracking ID
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  Business Outcomes <span className="text-muted">(in this release)</span>
                </Form.Label>
                <div style={{ fontSize: '0.8125rem' }}>
                  {businessOutcomes.slice(0, 3).map(bo => (
                    <div key={bo.id} className="mb-1">
                      <a href={`https://jira.example.com/browse/${bo.id}`} target="_blank" rel="noopener noreferrer">
                        {bo.id}
                      </a>
                      <span className="text-muted ml-2">- {bo.summary}</span>
                    </div>
                  ))}
                </div>
                <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                  Derived from Features assigned to this Fix Version
                </Form.Text>
              </Form.Group>
            </div>
          )}

          {/* Step 4: Target Environments & Summary */}
          {deploymentStep === 4 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Target Environments</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Select target service instances. A Change Request will be created in ServiceNow for each selected instance.
              </p>

              <Form.Label style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                Target Service Instances <span className="text-danger">*</span>
              </Form.Label>
              <div className="mb-3">
                {deploymentEnvironments.map(env => (
                  <Form.Check
                    key={env.id}
                    type="checkbox"
                    id={`env-${env.id}`}
                    label={<span style={{ fontSize: '0.875rem' }}>{env.name} <small className="text-muted">({env.siId})</small></span>}
                    checked={deploymentData.environments.includes(env.id)}
                    onChange={() => toggleEnvironment(env.id)}
                    className="mb-2"
                  />
                ))}
              </div>

              {/* Summary */}
              <Alert variant="light" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6', marginTop: '1.5rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Summary</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  <div><strong>Project:</strong> {deploymentData.selectedBacklog?.projectKey} - {deploymentData.selectedBacklog?.projectName}</div>
                  <div><strong>Fix Version:</strong> {deploymentData.selectedVersion?.name}</div>
                  <div><strong>Navigator ID:</strong> {deploymentData.navigatorId || '-'}</div>
                  <div><strong>Environments:</strong> {deploymentData.environments.length > 0
                    ? deploymentEnvironments.filter(e => deploymentData.environments.includes(e.id)).map(e => e.name).join(', ')
                    : 'None selected'}</div>
                </div>
              </Alert>

            </div>
          )}

          {/* Step 5: Attestation */}
          {deploymentStep === 5 && (
            <div>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Release Attestation</h6>
              <p className="text-muted" style={{ fontSize: '0.8125rem', marginBottom: '1rem' }}>
                Please confirm the following before creating the release:
              </p>

              <div className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="attest-code-reviewed"
                  label={<span style={{ fontSize: '0.875rem' }}>All code changes have been peer reviewed and approved</span>}
                  checked={deploymentData.attestations.codeReviewed}
                  onChange={() => toggleAttestation('codeReviewed')}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="attest-tests-pass"
                  label={<span style={{ fontSize: '0.875rem' }}>All automated tests pass successfully</span>}
                  checked={deploymentData.attestations.testsPass}
                  onChange={() => toggleAttestation('testsPass')}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="attest-security-scan"
                  label={<span style={{ fontSize: '0.875rem' }}>Security scans have been completed with no critical findings</span>}
                  checked={deploymentData.attestations.securityScan}
                  onChange={() => toggleAttestation('securityScan')}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="attest-documentation"
                  label={<span style={{ fontSize: '0.875rem' }}>Relevant documentation has been updated</span>}
                  checked={deploymentData.attestations.documentationUpdated}
                  onChange={() => toggleAttestation('documentationUpdated')}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="attest-rollback"
                  label={<span style={{ fontSize: '0.875rem' }}>A rollback plan has been documented and tested</span>}
                  checked={deploymentData.attestations.rollbackPlan}
                  onChange={() => toggleAttestation('rollbackPlan')}
                  className="mb-2"
                />
              </div>

              {/* Summary */}
              <Alert variant="light" style={{ fontSize: '0.8125rem', border: '1px solid #dee2e6', marginTop: '1.5rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Release Summary</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  <div><strong>Project:</strong> {deploymentData.selectedBacklog?.projectKey} - {deploymentData.selectedBacklog?.projectName}</div>
                  <div><strong>Fix Version:</strong> {deploymentData.selectedVersion?.name}</div>
                  <div><strong>Navigator ID:</strong> {deploymentData.navigatorId || '-'}</div>
                  <div><strong>Environments:</strong> {deploymentData.environments.length > 0
                    ? deploymentEnvironments.filter(e => deploymentData.environments.includes(e.id)).map(e => e.name).join(', ')
                    : 'None selected'}</div>
                </div>
              </Alert>

              {/* What happens next */}
              <Alert variant="info" style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
                <strong>What happens next:</strong>
                <ul className="mb-0" style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                  <li>Release record created using existing risk profile</li>
                  <li>ServiceNow CRs created per environment</li>
                  <li>Gate status determined by evidence coverage</li>
                </ul>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-between' }}>
          {deploymentStep > 1 ? (
            <Button variant="outline-secondary" onClick={() => setDeploymentStep(deploymentStep - 1)} style={{ fontSize: '0.875rem' }}>
              ← Back
            </Button>
          ) : (
            <div />
          )}
          <div>
            <Button variant="secondary" onClick={closeDeploymentWizard} className="mr-2" style={{ fontSize: '0.875rem' }}>
              Cancel
            </Button>
            {deploymentStep < 5 ? (
              <Button
                variant="dark"
                onClick={() => setDeploymentStep(deploymentStep + 1)}
                style={{ fontSize: '0.875rem' }}
                disabled={
                  (deploymentStep === 1 && !deploymentData.selectedBacklog) ||
                  (deploymentStep === 2 && !deploymentData.selectedVersion) ||
                  (deploymentStep === 3 && !deploymentData.navigatorId) ||
                  (deploymentStep === 4 && deploymentData.environments.length === 0)
                }
              >
                Next →
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => { alert('Release created successfully!'); closeDeploymentWizard(); }}
                style={{ fontSize: '0.875rem' }}
                disabled={!allAttestationsChecked()}
              >
                Create Release
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </PageLayout>
  );
}

export default AppProfile;
