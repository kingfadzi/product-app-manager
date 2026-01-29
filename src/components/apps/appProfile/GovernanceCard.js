import React from 'react';
import { Card, Tab, Nav, Table, Button } from 'react-bootstrap';
import { formatShortDate, getHealthColor } from './helpers';

function GovernanceCard({ businessOutcomes, riskStories, controlSmes, onViewOutcomes, onViewRisks, onOutcomeClick }) {
  return (
    <Card className="mb-4 tabbed-card">
      <Tab.Container defaultActiveKey="outcomes">
        <Card.Header>
          <strong>Governance & Controls</strong>
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
              <OutcomesTab
                outcomes={businessOutcomes}
                onViewMore={onViewOutcomes}
                onItemClick={onOutcomeClick}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="risk">
              <RiskStoriesTab stories={riskStories} onViewMore={onViewRisks} />
            </Tab.Pane>
            <Tab.Pane eventKey="guilds">
              <GuildsTab smes={controlSmes} />
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

function OutcomesTab({ outcomes, onViewMore, onItemClick }) {
  return (
    <>
      <Table size="sm" className="mb-0" borderless>
        <tbody>
          {outcomes.slice(0, 2).map(item => (
            <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => onItemClick(item)}>
              <td><span className="text-primary">{item.id}</span></td>
              <td>{item.summary}</td>
              <td className="text-muted">{item.status}</td>
              <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatShortDate(item.updated)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-right mt-2">
        <Button variant="link" size="sm" className="p-0" onClick={onViewMore}>
          View more →
        </Button>
      </div>
    </>
  );
}

function RiskStoriesTab({ stories, onViewMore }) {
  return (
    <>
      <Table size="sm" className="mb-0" borderless>
        <tbody>
          {stories.slice(0, 2).map(item => (
            <tr key={item.id}>
              <td>
                <a href={`https://jira.example.com/browse/${item.id}`} target="_blank" rel="noopener noreferrer">
                  {item.id}
                </a>
              </td>
              <td>{item.summary}</td>
              <td className="text-muted">{item.status}</td>
              <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatShortDate(item.updated)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-right mt-2">
        <Button variant="link" size="sm" className="p-0" onClick={onViewMore}>
          View more →
        </Button>
      </div>
    </>
  );
}

function GuildsTab({ smes }) {
  if (smes.length === 0) {
    return <p className="text-muted mb-0">No control SMEs assigned</p>;
  }

  return (
    <Table size="sm" className="mb-0" borderless>
      <tbody>
        {smes.map(sme => (
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
  );
}

function HealthIndicator({ health }) {
  return (
    <span
      title={health}
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: getHealthColor(health)
      }}
    />
  );
}

function BlockedIndicator({ blocked }) {
  if (blocked) {
    return <span title="Blocked" style={{ color: '#dc3545' }}>&#x26D4;</span>;
  }
  return <span title="Not blocked" style={{ color: '#28a745' }}>&#x2713;</span>;
}

export default GovernanceCard;
