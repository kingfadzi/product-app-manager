import React from 'react';
import { Table, Badge, Alert } from 'react-bootstrap';
import RemediationBox from '../../common/RemediationBox';
import { useAddAppWizard } from './AddAppWizardContext';
import { getResCatBadgeColor } from './helpers';

function DetailsStep() {
  const { selectedApp, availableRepos, availableJira } = useAddAppWizard();

  if (!selectedApp) return null;

  const missingRepos = availableRepos.length === 0;
  const missingJira = availableJira.length === 0;
  const showWarning = missingRepos || missingJira;

  return (
    <>
      <AppDetailsTable app={selectedApp} />

      {showWarning && (
        <MissingDataWarning missingRepos={missingRepos} missingJira={missingJira} />
      )}

      <RemediationBox
        dataSource="Application details are sourced from CMDB."
        contactEmail="cmdb-support@example.com"
        linkUrl="https://servicenow.example.com/cmdb"
        linkText="Open ServiceNow CMDB"
      />
    </>
  );
}

function AppDetailsTable({ app }) {
  return (
    <Table bordered>
      <tbody>
        <tr>
          <th style={{ width: '40%' }}>Application ID</th>
          <td>{app.cmdbId}</td>
        </tr>
        <tr>
          <th>Application Name</th>
          <td>{app.name}</td>
        </tr>
        <tr>
          <th>Product Owner</th>
          <td>{app.productOwner}</td>
        </tr>
        <tr>
          <th>System Architect</th>
          <td>{app.systemArchitect}</td>
        </tr>
        <tr>
          <th>Application Tier</th>
          <td>{app.tier}</td>
        </tr>
        <tr>
          <th>Resilience Category</th>
          <td>
            <Badge bg={getResCatBadgeColor(app.resCat)}>{app.resCat}</Badge>
          </td>
        </tr>
        <tr>
          <th>Operational Status</th>
          <td>{app.operationalStatus}</td>
        </tr>
      </tbody>
    </Table>
  );
}

function MissingDataWarning({ missingRepos, missingJira }) {
  const missingText = missingRepos && missingJira
    ? 'repositories and Jira projects'
    : missingRepos
    ? 'repositories'
    : 'Jira projects';

  return (
    <Alert variant="warning">
      <strong>Warning:</strong> This application is missing {missingText} in DSI.
      You can add them manually in the following steps.
    </Alert>
  );
}

export default DetailsStep;
