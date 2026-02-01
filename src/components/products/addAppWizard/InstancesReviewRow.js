import React from 'react';
import { Badge } from 'react-bootstrap';
import { getEnvBadgeColor } from './helpers';

function InstancesReviewRow({ instances }) {
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

export default InstancesReviewRow;
