import React from 'react';
import { Badge } from 'react-bootstrap';
import { getEnvBadgeColor, getRepoTypeBadgeColor } from './helpers';

export function ApplicationReviewRows({ app }) {
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

export function ProductReviewRow({ product }) {
  return (
    <tr>
      <th className="bg-light">Product</th>
      <td>
        <strong>{product?.name}</strong>
        {product?.id && <span className="text-muted ms-2">({product.id})</span>}
        {product?.stackId && <span className="text-muted ms-2">- {product.stackId}</span>}
      </td>
    </tr>
  );
}

export function InstancesReviewRow({ instances }) {
  return (
    <tr>
      <th className="bg-light align-top">Service Instances ({instances.length})</th>
      <td>
        {instances.length > 0 ? (
          instances.map((si, idx) => (
            <span key={si.siId}>
              <Badge bg={getEnvBadgeColor(si.environment)} className="me-1">
                {si.environment}
              </Badge>
              {si.name} <span className="text-muted">({si.siId})</span>
              {idx < instances.length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-muted">None</span>
        )}
      </td>
    </tr>
  );
}

export function ReposReviewRow({ repos }) {
  return (
    <tr>
      <th className="bg-light align-top">Repositories ({repos.length})</th>
      <td>
        {repos.length > 0 ? (
          repos.map((repo, idx) => (
            <span key={repo.repoId}>
              <Badge bg={getRepoTypeBadgeColor(repo.type)} className="me-1">
                {repo.type}
              </Badge>
              {repo.slug || repo.name}
              {idx < repos.length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-muted">None selected</span>
        )}
      </td>
    </tr>
  );
}

export function JiraReviewRow({ projects }) {
  return (
    <tr>
      <th className="bg-light align-top">Jira Projects ({projects.length})</th>
      <td>
        {projects.length > 0 ? (
          projects.map((project, idx) => (
            <span key={project.projectKey}>
              <strong>{project.projectKey}</strong> - {project.projectName}
              {idx < projects.length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-muted">None selected</span>
        )}
      </td>
    </tr>
  );
}

export function DocsReviewRow({ docs }) {
  return (
    <tr>
      <th className="bg-light align-top">Documentation ({docs.length})</th>
      <td>
        {docs.length > 0 ? (
          docs.map((doc, idx) => (
            <span key={doc.type}>
              <strong>{doc.type}</strong>
              {idx < docs.length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-muted">None added</span>
        )}
      </td>
    </tr>
  );
}
