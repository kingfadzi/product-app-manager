import React from 'react';
import { Modal, Button, Card, Table } from 'react-bootstrap';
import { formatShortDate } from './helpers';
import { JIRA_BASE_URL } from '../../../constants/config';

function RiskStoryModal({ show, risk, onHide, onBack }) {
  if (!risk) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open': return 'danger';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Waived': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static" keyboard={false}>
      <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ fontSize: '1rem', fontWeight: 600 }}>
          {risk.id} - {risk.summary}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: '0.5rem' }}>
        <Card>
          <Card.Header style={{ background: 'none' }}><strong>Details</strong></Card.Header>
          <Card.Body>
            <Table size="sm" className="mb-0" borderless>
              <tbody>
                <tr>
                  <td className="text-muted" style={{ width: '120px' }}>Risk ID</td>
                  <td>
                    <a href={`${JIRA_BASE_URL}/browse/${risk.id}`} target="_blank" rel="noopener noreferrer">
                      {risk.id}
                    </a>
                  </td>
                  <td className="text-muted" style={{ width: '120px' }}>Status</td>
                  <td>
                    <span className={`badge bg-${getStatusBadgeClass(risk.status)}`}>{risk.status}</span>
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Summary</td>
                  <td colSpan={3}>{risk.summary}</td>
                </tr>
                <tr>
                  <td className="text-muted">Last Updated</td>
                  <td colSpan={3}>{formatShortDate(risk.updated)}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="outline-secondary" onClick={onBack} style={{ fontSize: '0.875rem' }}>
          ← Back to List
        </Button>
        <div>
          <Button
            variant="primary"
            href={`${JIRA_BASE_URL}/browse/${risk.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.875rem' }}
            className="mr-2"
          >
            View in Jira
          </Button>
          <Button variant="secondary" onClick={onHide} style={{ fontSize: '0.875rem' }}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default RiskStoryModal;
