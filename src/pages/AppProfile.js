import React, { useContext, useState } from 'react';
import { Row, Col, Button, Alert, Breadcrumb } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import PageLayout from '../components/layout/PageLayout';
import {
  AppHeader,
  AppDetailsCard,
  DocumentationCard,
  GovernanceCard,
  DeploymentsCard,
  SourceCodeCard,
  RiskOutcomesModal,
  BusinessOutcomeModal,
  RiskStoryModal,
  DeploymentWizardModal,
  useAppProfileData
} from '../components/apps/appProfile';
import '../styles/tabs.css';

function AppProfile() {
  const { id } = useParams();
  const history = useHistory();
  const { apps, products } = useContext(AppContext);
  const { isLoggedIn } = useUser();
  const readOnly = !isLoggedIn;

  // Load app profile data
  const {
    repos,
    backlogs,
    contacts,
    docs,
    riskStories,
    businessOutcomes,
    guildSmes,
    deploymentEnvironments,
    fixVersions,
    loadFixVersions,
    addContact,
    removeContact,
    addDoc,
    removeDoc,
    addGuildSme,
    removeGuildSme,
  } = useAppProfileData(id);

  // Modal states
  const [showModal, setShowModal] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showDeploymentWizard, setShowDeploymentWizard] = useState(false);

  const handleItemClick = (item, type) => {
    if (type === 'outcomes') {
      setSelectedOutcome(item);
    } else {
      setSelectedRisk(item);
    }
  };

  const app = apps.find(a => a.id === id || a.cmdbId === id);

  // Get products this app belongs to from app.memberOfProducts
  // Look up full product details from products array to get stack info
  const appProducts = (app?.memberOfProducts || []).map(p => {
    const fullProduct = products.find(prod => prod.id === p.productId);
    return {
      id: p.productId,
      name: p.productName,
      stack: fullProduct?.stackId || null,
    };
  });

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

  return (
    <PageLayout>
      <AppBreadcrumb history={history} app={app} appProducts={appProducts} />
      <AppHeader app={app} />

      <Row>
        <Col lg={6}>
          <AppDetailsCard
            app={app}
            contacts={contacts}
            appProducts={appProducts}
            onAddContact={addContact}
            onRemoveContact={removeContact}
            readOnly={readOnly}
          />
          <DocumentationCard
            docs={docs}
            onAddDoc={addDoc}
            onRemoveDoc={removeDoc}
            readOnly={readOnly}
          />
        </Col>

        <Col lg={6}>
          <GovernanceCard
            businessOutcomes={businessOutcomes}
            riskStories={riskStories}
            guildSmes={guildSmes}
            onViewOutcomes={() => setShowModal('outcomes')}
            onViewRisks={() => setShowModal('risks')}
            onOutcomeClick={setSelectedOutcome}
            onRiskClick={setSelectedRisk}
            onAddGuildSme={addGuildSme}
            onRemoveGuildSme={removeGuildSme}
            readOnly={readOnly}
          />
          <DeploymentsCard onCreateDeployment={() => setShowDeploymentWizard(true)} readOnly={readOnly} />
          <SourceCodeCard repos={repos} backlogs={backlogs} />
        </Col>
      </Row>

      <RiskOutcomesModal
        show={!!showModal}
        type={showModal}
        data={showModal === 'risks' ? riskStories : businessOutcomes}
        onHide={() => setShowModal(null)}
        onItemClick={handleItemClick}
      />

      <BusinessOutcomeModal
        show={!!selectedOutcome}
        outcome={selectedOutcome}
        guildSmes={guildSmes}
        onHide={() => setSelectedOutcome(null)}
        onBack={() => {
          setSelectedOutcome(null);
          setShowModal('outcomes');
        }}
        readOnly={readOnly}
      />

      <RiskStoryModal
        show={!!selectedRisk}
        risk={selectedRisk}
        onHide={() => setSelectedRisk(null)}
        onBack={() => {
          setSelectedRisk(null);
          setShowModal('risks');
        }}
      />

      <DeploymentWizardModal
        show={showDeploymentWizard}
        onHide={() => setShowDeploymentWizard(false)}
        backlogs={backlogs}
        businessOutcomes={businessOutcomes}
        deploymentEnvironments={deploymentEnvironments}
        fixVersions={fixVersions}
        loadFixVersions={loadFixVersions}
      />
    </PageLayout>
  );
}

function AppBreadcrumb({ history, app, appProducts }) {
  return (
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
  );
}

export default AppProfile;
