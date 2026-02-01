import React from 'react';
import {
  BusinessOutcomeModal,
  DeploymentWizardModal,
  RiskOutcomesModal,
  RiskStoryModal,
} from './index';

function AppProfileModals({
  showModal,
  selectedOutcome,
  selectedRisk,
  guildSmes,
  riskStories,
  businessOutcomes,
  backlogs,
  deploymentEnvironments,
  fixVersions,
  loadFixVersions,
  onHideModal,
  onSelectOutcome,
  onSelectRisk,
  onShowOutcomes,
  onShowRisks,
  showDeploymentWizard,
  onHideDeploymentWizard,
  readOnly,
}) {
  return (
    <>
      <RiskOutcomesModal
        show={!!showModal}
        type={showModal}
        data={showModal === 'risks' ? riskStories : businessOutcomes}
        onHide={onHideModal}
        onItemClick={(item) => (showModal === 'outcomes' ? onSelectOutcome(item) : onSelectRisk(item))}
      />

      <BusinessOutcomeModal
        show={!!selectedOutcome}
        outcome={selectedOutcome}
        guildSmes={guildSmes}
        onHide={() => onSelectOutcome(null)}
        onBack={() => {
          onSelectOutcome(null);
          onShowOutcomes();
        }}
        readOnly={readOnly}
      />

      <RiskStoryModal
        show={!!selectedRisk}
        risk={selectedRisk}
        onHide={() => onSelectRisk(null)}
        onBack={() => {
          onSelectRisk(null);
          onShowRisks();
        }}
      />

      <DeploymentWizardModal
        show={showDeploymentWizard}
        onHide={onHideDeploymentWizard}
        backlogs={backlogs}
        businessOutcomes={businessOutcomes}
        deploymentEnvironments={deploymentEnvironments}
        fixVersions={fixVersions}
        loadFixVersions={loadFixVersions}
      />
    </>
  );
}

export default AppProfileModals;
