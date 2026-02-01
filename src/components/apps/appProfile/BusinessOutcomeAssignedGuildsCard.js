import React from 'react';
import { Card, Table } from 'react-bootstrap';
import HealthIndicator from './HealthIndicator';
import BlockedIndicator from './BlockedIndicator';

function BusinessOutcomeAssignedGuildsCard({ wizardData, guildSmes }) {
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

export default BusinessOutcomeAssignedGuildsCard;
