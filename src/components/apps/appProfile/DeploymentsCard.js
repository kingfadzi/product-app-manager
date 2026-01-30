import React from 'react';
import { Card, Tab, Nav, Button } from 'react-bootstrap';

function DeploymentsCard({ onCreateDeployment, readOnly }) {
  return (
    <Card className="mb-4 tabbed-card">
      <Tab.Container defaultActiveKey="releases">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <strong>Deployments</strong>
            {!readOnly && <Button variant="dark" size="sm" onClick={onCreateDeployment}>+ Create</Button>}
          </div>
          <Nav variant="tabs" className="mt-2">
            <Nav.Item><Nav.Link eventKey="releases">Releases</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="history">History</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="crs">CRs</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="releases">
              <p className="text-muted mb-0">No active releases</p>
            </Tab.Pane>
            <Tab.Pane eventKey="history">
              <p className="text-muted mb-0">No deployment history available</p>
            </Tab.Pane>
            <Tab.Pane eventKey="crs">
              <p className="text-muted mb-0">No change requests available</p>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

export default DeploymentsCard;
