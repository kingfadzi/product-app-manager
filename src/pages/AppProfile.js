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
  useAppProfileData
} from '../components/apps/appProfile';
import AppBreadcrumb from '../components/apps/appProfile/AppBreadcrumb';
import AppProfileModals from '../components/apps/appProfile/AppProfileModals';
import '../styles/tabs.css';

function AppProfile() {
  const { id } = useParams();
  const history = useHistory();
  const { apps, products } = useContext(AppContext);
  const { isLoggedIn } = useUser();
  const readOnly = !isLoggedIn;

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
    error,
    syncing,
    syncError,
    loadFixVersions,
    addContact,
    removeContact,
    addDoc,
    removeDoc,
    addGuildSme,
    removeGuildSme,
    syncGovernance,
  } = useAppProfileData(id);

  const [showModal, setShowModal] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showDeploymentWizard, setShowDeploymentWizard] = useState(false);

  const app = apps.find(a => a.id === id || a.cmdbId === id);

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
      {error && <Alert variant="danger">{error}</Alert>}

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
            onSync={syncGovernance}
            syncing={syncing}
            syncError={syncError}
            readOnly={readOnly}
          />
          <DeploymentsCard onCreateDeployment={() => setShowDeploymentWizard(true)} readOnly={readOnly} />
          <SourceCodeCard repos={repos} backlogs={backlogs} />
        </Col>
      </Row>

      <AppProfileModals
        showModal={showModal}
        selectedOutcome={selectedOutcome}
        selectedRisk={selectedRisk}
        guildSmes={guildSmes}
        riskStories={riskStories}
        businessOutcomes={businessOutcomes}
        backlogs={backlogs}
        deploymentEnvironments={deploymentEnvironments}
        fixVersions={fixVersions}
        loadFixVersions={loadFixVersions}
        onHideModal={() => setShowModal(null)}
        onSelectOutcome={setSelectedOutcome}
        onSelectRisk={setSelectedRisk}
        onShowOutcomes={() => setShowModal('outcomes')}
        onShowRisks={() => setShowModal('risks')}
        showDeploymentWizard={showDeploymentWizard}
        onHideDeploymentWizard={() => setShowDeploymentWizard(false)}
        readOnly={readOnly}
      />
    </PageLayout>
  );
}

export default AppProfile;
