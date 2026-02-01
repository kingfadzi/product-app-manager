import React from 'react';

function ApplicationReviewRows({ app }) {
  return (
    <>
      <tr>
        <th style={{ width: '30%' }} className="bg-light">Application</th>
        <td>
          <strong>{app?.name}</strong>
          <span className="text-muted ms-2">({app?.cmdbId})</span>
        </td>
      </tr>
      <tr>
        <th className="bg-light">Tier / Stack</th>
        <td>{app?.tier} {app?.stack && <span className="text-muted">/ {app?.stack}</span>}</td>
      </tr>
      <tr>
        <th className="bg-light">Transaction Cycle</th>
        <td>{app?.transactionCycle ? `${app.transactionCycle} (${app.transactionCycleId})` : <span className="text-muted">Not set</span>}</td>
      </tr>
      <tr>
        <th className="bg-light">Operational Status</th>
        <td>{app?.operationalStatus || <span className="text-muted">Not set</span>}</td>
      </tr>
      <tr>
        <th className="bg-light">Resilience Category</th>
        <td>{app?.resilienceCategory || <span className="text-muted">Not set</span>}</td>
      </tr>
      <tr>
        <th className="bg-light">Product Owner</th>
        <td>{app?.productOwner || <span className="text-muted">Not set</span>}</td>
      </tr>
      <tr>
        <th className="bg-light">System Architect</th>
        <td>{app?.systemArchitect || <span className="text-muted">Not set</span>}</td>
      </tr>
    </>
  );
}

export default ApplicationReviewRows;
