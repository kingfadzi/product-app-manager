import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import RemediationBox from '../../common/RemediationBox';
import { useAddAppWizard } from './AddAppWizardContext';
import { getResCatBadgeColor } from './helpers';

function DetailsStep() {
  const { selectedApp, selectedProduct } = useAddAppWizard();

  if (!selectedApp) return null;

  return (
    <>
      <AppDetailsTable app={selectedApp} product={selectedProduct} />

      <RemediationBox
        dataSource="Application details are sourced from CMDB."
        contactEmail="cmdb-support@example.com"
        linkUrl="https://servicenow.example.com/cmdb"
        linkText="Open ServiceNow CMDB"
      />
    </>
  );
}

function AppDetailsTable({ app, product }) {
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
          <th>Product</th>
          <td>{product ? `${product.name} (${product.id})` : <span className="text-muted">Not selected</span>}</td>
        </tr>
        <tr>
          <th>Transaction Cycle</th>
          <td>{app.transactionCycle ? `${app.transactionCycle} (${app.transactionCycleId})` : <span className="text-muted">Not set</span>}</td>
        </tr>
        <tr>
          <th>Product Owner</th>
          <td>{app.productOwner || <span className="text-muted">Not set</span>}</td>
        </tr>
        <tr>
          <th>System Architect</th>
          <td>{app.systemArchitect || <span className="text-muted">Not set</span>}</td>
        </tr>
        <tr>
          <th>Application Tier</th>
          <td>{app.tier}</td>
        </tr>
        <tr>
          <th>Stack</th>
          <td>{app.stack || <span className="text-muted">Not set</span>}</td>
        </tr>
        <tr>
          <th>Resilience Category</th>
          <td>
            {app.resilienceCategory ? (
              <Badge bg={getResCatBadgeColor(app.resilienceCategory)}>{app.resilienceCategory}</Badge>
            ) : (
              <span className="text-muted">Not set</span>
            )}
          </td>
        </tr>
        <tr>
          <th>Operational Status</th>
          <td>{app.operationalStatus || <span className="text-muted">Not set</span>}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default DetailsStep;
