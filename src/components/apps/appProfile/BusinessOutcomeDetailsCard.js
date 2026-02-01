import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { JIRA_BASE_URL } from '../../../constants/config';

function BusinessOutcomeDetailsCard({ outcome }) {
  return (
    <Card className="mb-3">
      <Card.Header style={{ background: 'none' }}><strong>Details</strong></Card.Header>
      <Card.Body>
        <Table size="sm" className="mb-0" borderless>
          <tbody>
            <tr>
              <td className="text-muted" style={{ width: '120px' }}>Fix Releases</td>
              <td><FixReleasesList releases={outcome.fixReleases} /></td>
              <td className="text-muted" style={{ width: '120px' }}>Status</td>
              <td>{outcome.status}</td>
            </tr>
            <tr>
              <td className="text-muted">Navigator ID</td>
              <td><NavigatorLink id={outcome.navigatorId} /></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="text-muted">Description</td>
              <td colSpan={3}>{outcome.description}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
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

export default BusinessOutcomeDetailsCard;
