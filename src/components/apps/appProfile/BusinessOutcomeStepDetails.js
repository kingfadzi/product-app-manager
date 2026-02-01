import React from 'react';
import { JIRA_BASE_URL } from '../../../constants/config';

function BusinessOutcomeStepDetails({ outcome }) {
  return (
    <div>
      <h6 className="mb-3">Business Outcome Details</h6>
      <table className="table table-sm table-borderless">
        <tbody>
          <tr>
            <td className="text-muted" style={{ width: '140px' }}>Fix Releases</td>
            <td><FixReleasesList releases={outcome.fixReleases} /></td>
          </tr>
          <tr>
            <td className="text-muted">Description</td>
            <td>{outcome.description}</td>
          </tr>
          <tr>
            <td className="text-muted">Navigator ID</td>
            <td><NavigatorLink id={outcome.navigatorId} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function FixReleasesList({ releases }) {
  if (!releases?.length) return '-';
  return releases.map((release, i) => (
    <span key={release}>
      {i > 0 && ', '}
      <a href={`${JIRA_BASE_URL}/issues/?jql=fixVersion="${release}"`} target="_blank" rel="noopener noreferrer">
        {release}
      </a>
    </span>
  ));
}

function NavigatorLink({ id }) {
  if (!id) return '-';
  return (
    <a href={`https://navigator.example.com/${id}`} target="_blank" rel="noopener noreferrer">
      {id}
    </a>
  );
}

export default BusinessOutcomeStepDetails;
