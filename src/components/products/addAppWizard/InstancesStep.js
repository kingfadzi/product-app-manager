import React from 'react';
import { Table, Badge, Alert } from 'react-bootstrap';
import RemediationBox from '../../common/RemediationBox';
import PaginatedTableWrapper from './PaginatedTableWrapper';
import { useAddAppWizard } from './AddAppWizardContext';
import { getEnvBadgeColor } from './helpers';

function InstancesStep() {
  const { serviceInstances } = useAddAppWizard();

  if (serviceInstances.length === 0) {
    return <NoInstancesAlert />;
  }

  return (
    <>
      <EnvironmentSummary instances={serviceInstances} />
      <InstancesTable instances={serviceInstances} />
      <RemediationBox
        dataSource="Service instance data is sourced from CMDB."
        contactEmail="cmdb-support@example.com"
        linkUrl="https://servicenow.example.com/cmdb"
        linkText="Open ServiceNow CMDB"
      />
    </>
  );
}

function NoInstancesAlert() {
  return (
    <>
      <Alert variant="danger">
        <strong>Cannot proceed:</strong> No service instances found for this application in CMDB.
        Service instances are required to complete onboarding. Please contact CMDB support.
      </Alert>
      <RemediationBox
        dataSource="Service instance data is sourced from CMDB."
        contactEmail="cmdb-support@example.com"
        linkUrl="https://servicenow.example.com/cmdb"
        linkText="Open ServiceNow CMDB"
      />
    </>
  );
}

function EnvironmentSummary({ instances }) {
  const counts = {};
  instances.forEach(si => {
    counts[si.environment] = (counts[si.environment] || 0) + 1;
  });

  const summary = Object.entries(counts)
    .map(([env, count]) => `${env} (${count})`)
    .join(', ');

  return (
    <div className="mb-3 text-muted small">
      <strong>Summary:</strong> {summary}
    </div>
  );
}

function InstancesTable({ instances }) {
  const renderTable = (paginatedData) => (
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
              <Badge bg={getEnvBadgeColor(si.environment)}>{si.environment}</Badge>
            </td>
            <td>{si.siId}</td>
            <td>{si.name}</td>
            <td>{si.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <PaginatedTableWrapper
      data={instances}
      itemsPerPage={5}
      itemLabel="instances"
      renderTable={renderTable}
    />
  );
}

export default InstancesStep;
