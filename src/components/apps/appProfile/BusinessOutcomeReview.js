import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { getHealthColor } from './helpers';
import { formatYesNo, formatDeploymentStrategy } from './businessOutcomeConstants';

/**
 * Review mode for BusinessOutcomeModal
 * Displays outcome details, delta docs, assessment, and assigned guilds
 */
function BusinessOutcomeReview({ outcome, wizardData, guildSmes }) {
  return (
    <div>
      <DetailsCard outcome={outcome} />
      <DeltaDocCard wizardData={wizardData} />
      <GuildAssessmentCard wizardData={wizardData} />
      <AssignedGuildsCard wizardData={wizardData} guildSmes={guildSmes} />
    </div>
  );
}

function DetailsCard({ outcome }) {
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
      <a href={`https://jira.example.com/issues/?jql=fixVersion="${release}"`} target="_blank" rel="noopener noreferrer">
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

function DeltaDocCard({ wizardData }) {
  return (
    <Card className="mb-3">
      <Card.Header style={{ background: 'none' }}><strong>Delta Documentation</strong></Card.Header>
      <Card.Body>
        <Table size="sm" className="mb-0" borderless>
          <tbody>
            <DocRow label="Product Delta" url={wizardData.productDeltaDoc} />
            <DocRow label="Architecture Delta" url={wizardData.architectureDeltaDoc} />
            <DocRow label="Service Vision Delta" url={wizardData.serviceVisionDeltaDoc} />
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

function DocRow({ label, url }) {
  return (
    <tr>
      <td className="text-muted" style={{ width: '150px' }}>{label}</td>
      <td>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">View Document &rarr;</a>
        ) : (
          <span className="text-muted">Not provided</span>
        )}
      </td>
    </tr>
  );
}

function GuildAssessmentCard({ wizardData }) {
  const { questionnaire } = wizardData;

  return (
    <Card className="mb-3">
      <Card.Header style={{ background: 'none' }}><strong>Guild Engagement Assessment</strong></Card.Header>
      <Card.Body>
        <Table size="sm" className="mb-0" borderless>
          <tbody>
            <tr>
              <td className="text-muted" style={{ width: '150px' }}>Impacts Data</td>
              <td>{formatYesNo(questionnaire.impactsData)}</td>
              <td className="text-muted" style={{ width: '150px' }}>Arch Review</td>
              <td>{formatYesNo(questionnaire.requiresArchReview)}</td>
            </tr>
            <tr>
              <td className="text-muted">Impacts Security</td>
              <td>{formatYesNo(questionnaire.impactsSecurity)}</td>
              <td className="text-muted">Deploy Strategy</td>
              <td>{formatDeploymentStrategy(questionnaire.deploymentStrategy)}</td>
            </tr>
            <tr>
              <td className="text-muted">Impacts Accessibility</td>
              <td>{formatYesNo(questionnaire.impactsAccessibility)}</td>
              <td></td><td></td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

function AssignedGuildsCard({ wizardData, guildSmes }) {
  const assignedSmes = guildSmes.filter(sme => wizardData.selectedGuilds.includes(sme.id));

  return (
    <Card>
      <Card.Header style={{ background: 'none' }}><strong>Assigned Guilds</strong></Card.Header>
      <Card.Body>
        {assignedSmes.length === 0 ? (
          <p className="text-muted mb-0">No guilds assigned</p>
        ) : (
          <Table size="sm" className="mb-0" borderless>
            <tbody>
              {assignedSmes.map(sme => (
                <tr key={sme.id}>
                  <td><a href={`mailto:${sme.email}`}>{sme.name}</a></td>
                  <td>{sme.guild}</td>
                  <td style={{ width: '30px', textAlign: 'center' }}>
                    <HealthIndicator health={sme.health} />
                  </td>
                  <td style={{ width: '30px', textAlign: 'center' }}>
                    <BlockedIndicator blocked={sme.blocked} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

function HealthIndicator({ health }) {
  return (
    <span style={{
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: getHealthColor(health)
    }} />
  );
}

function BlockedIndicator({ blocked }) {
  if (blocked) {
    return <span style={{ color: '#dc3545' }}>&#x26D4;</span>;
  }
  return <span style={{ color: '#28a745' }}>&#x2713;</span>;
}

export default BusinessOutcomeReview;
