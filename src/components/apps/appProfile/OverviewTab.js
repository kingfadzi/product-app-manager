import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { getResCatBadgeClass } from './helpers';
import DetailRow from './DetailRow';

function OverviewTab({ app }) {
  return (
    <Row>
      <Col xs={6}>
        <DetailRow label="App ID" value={app.cmdbId} />
        <DetailRow label="Owner" value={app.productOwner || '-'} />
        <DetailRow label="Tier" value={app.tier || '-'} />
        <DetailRow label="Status" value={app.operationalStatus || '-'} />
      </Col>
      <Col xs={6}>
        <DetailRow label="Name" value={app.name} />
        <DetailRow label="Architect" value={app.systemArchitect || '-'} />
        <div className="mb-1 d-flex align-items-center">
          <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>Res. Category</span>
          {app.resCat ? (
            <span className={`badge bg-${getResCatBadgeClass(app.resCat)}`}>{app.resCat}</span>
          ) : '-'}
        </div>
      </Col>
    </Row>
  );
}

export default OverviewTab;
