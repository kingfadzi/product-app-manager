import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { formatYesNo, formatDeploymentStrategy } from './businessOutcomeConstants';

function BusinessOutcomeGuildAssessmentCard({ wizardData }) {
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

export default BusinessOutcomeGuildAssessmentCard;
