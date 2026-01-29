import React, { useContext, useState } from 'react';
import { Row, Col, Button, Alert, Breadcrumb } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
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
  DeploymentWizardModal,
  useAppProfileData
} from '../components/apps/appProfile';
import '../styles/tabs.css';

function AppProfile() {
  const { id } = useParams();
  const history = useHistory();
  const { apps, products, productApps } = useContext(AppContext);

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
  const [showDeploymentWizard, setShowDeploymentWizard] = useState(false);

  const app = apps.find(a => a.id === id);

  // Find products this app belongs to
  const appProductIds = productApps
    .filter(pa => pa.appId === id)
    .map(pa => pa.productId);
  const appProducts = products.filter(p => appProductIds.includes(p.id));

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
          />
          <DocumentationCard
            docs={docs}
            onAddDoc={addDoc}
            onRemoveDoc={removeDoc}
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
            onAddGuildSme={addGuildSme}
            onRemoveGuildSme={removeGuildSme}
          />
          <DeploymentsCard onCreateDeployment={() => setShowDeploymentWizard(true)} />
          <SourceCodeCard repos={repos} backlogs={backlogs} />
        </Col>
      </Row>

      <RiskOutcomesModal
        show={!!showModal}
        type={showModal}
        data={showModal === 'risks' ? riskStories : businessOutcomes}
        onHide={() => setShowModal(null)}
        onOutcomeClick={setSelectedOutcome}
      />

      <BusinessOutcomeModal
        show={!!selectedOutcome}
        outcome={selectedOutcome}
        guildSmes={guildSmes}
        onHide={() => setSelectedOutcome(null)}
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
