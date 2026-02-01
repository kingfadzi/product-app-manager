import React from 'react';
import { Card, Tab, Nav, Alert } from 'react-bootstrap';
import SyncButton from '../../common/SyncButton';
import { OutcomesTab, RiskStoriesTab, GuildsTab } from './tabs';

function GovernanceCard({
  businessOutcomes,
  riskStories,
  guildSmes,
  onViewOutcomes,
  onViewRisks,
  onOutcomeClick,
  onRiskClick,
  onAddGuildSme,
  onRemoveGuildSme,
  onSync,
  syncing,
  syncError,
  readOnly,
}) {
  return (
    <Card className="mb-4 tabbed-card">
      <Tab.Container defaultActiveKey="outcomes">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <strong>Governance & Controls</strong>
            {onSync && (
              <SyncButton onSync={onSync} syncing={syncing} title="Sync from Jira" />
            )}
          </div>
          {syncError && (
            <Alert variant="danger" className="mt-2 mb-0 py-2">
              {syncError}
            </Alert>
          )}
          <Nav variant="tabs" className="mt-2">
            <Nav.Item><Nav.Link eventKey="outcomes">Business Outcomes</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="risk">Risk Stories</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="guilds">Guilds</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="audit">Audit Log</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="outcomes">
              <OutcomesTab outcomes={businessOutcomes} onViewMore={onViewOutcomes} onItemClick={onOutcomeClick} />
            </Tab.Pane>
            <Tab.Pane eventKey="risk">
              <RiskStoriesTab stories={riskStories} onViewMore={onViewRisks} onItemClick={onRiskClick} />
            </Tab.Pane>
            <Tab.Pane eventKey="guilds">
              <GuildsTab smes={guildSmes} onAdd={onAddGuildSme} onRemove={onRemoveGuildSme} readOnly={readOnly} />
            </Tab.Pane>
            <Tab.Pane eventKey="audit">
              <p className="text-muted mb-0">No audit entries available</p>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

export default GovernanceCard;
