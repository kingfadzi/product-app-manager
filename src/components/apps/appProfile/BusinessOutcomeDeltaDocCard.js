import React from 'react';
import { Card, Table } from 'react-bootstrap';

function BusinessOutcomeDeltaDocCard({ wizardData }) {
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

export default BusinessOutcomeDeltaDocCard;
