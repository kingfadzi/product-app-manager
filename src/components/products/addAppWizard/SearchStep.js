import React from 'react';
import { Form, ListGroup, Badge } from 'react-bootstrap';
import useCmdbAppSearch from '../../../hooks/useCmdbAppSearch';
import RemediationBox from '../../common/RemediationBox';
import { useAddAppWizard } from './AddAppWizardContext';
import { getTierBadgeColor } from './helpers';

function SearchStep({ onSelect }) {
  // Use prop if provided, otherwise fall back to context (for backwards compat)
  const { selectApp } = useAddAppWizard();
  const handleSelect = onSelect || selectApp;
  const { searchTerm, setSearchTerm, results, loading, error } = useCmdbAppSearch(2);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by App ID or Application Name..."
        />
      </Form.Group>

      <ListGroup style={{ maxHeight: '350px', overflow: 'auto' }}>
        {renderSearchResults(searchTerm, results, loading, error, handleSelect)}
      </ListGroup>

      <RemediationBox
        dataSource="Application data is sourced from CMDB."
        contactEmail="cmdb-support@example.com"
        linkUrl="https://servicenow.example.com/cmdb"
        linkText="Open ServiceNow CMDB"
      />
    </>
  );
}

function renderSearchResults(searchTerm, results, loading, error, onSelect) {
  if (searchTerm.length === 0) {
    return (
      <ListGroup.Item className="text-center text-muted">
        Start typing to search for applications in CMDB
      </ListGroup.Item>
    );
  }

  if (searchTerm.length < 2) {
    return (
      <ListGroup.Item className="text-center text-muted">
        Type at least 2 characters to search
      </ListGroup.Item>
    );
  }

  if (loading) {
    return (
      <ListGroup.Item className="text-center text-muted">
        Searching CMDB...
      </ListGroup.Item>
    );
  }

  if (error) {
    return (
      <ListGroup.Item className="text-center text-danger">
        {error}
      </ListGroup.Item>
    );
  }

  if (results.length === 0) {
    return (
      <ListGroup.Item className="text-center text-muted">
        No applications found in CMDB
      </ListGroup.Item>
    );
  }

  return results.map(app => (
    <SearchResultItem key={app.cmdbId} app={app} onSelect={onSelect} />
  ));
}

function SearchResultItem({ app, onSelect }) {
  const hasProducts = app.isOnboarded && app.memberOfProducts?.length > 0;

  return (
    <ListGroup.Item action onClick={() => onSelect(app)} className="p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <strong>{app.name}</strong>
          <div className="text-muted small">{app.cmdbId}</div>
          {app.transactionCycle && (
            <div className="text-muted small">{app.transactionCycle} ({app.transactionCycleId})</div>
          )}
        </div>
        <div className="text-end">
          <Badge bg={getTierBadgeColor(app.tier)}>{app.tier}</Badge>
          <div className="text-muted small">{app.productOwner}</div>
        </div>
      </div>
      {hasProducts && (
        <div className="mt-2">
          <Badge bg="warning" text="dark">Already in:</Badge>
          <span className="text-muted small ms-2">
            {app.memberOfProducts.map(p => p.productName).join(', ')}
          </span>
        </div>
      )}
    </ListGroup.Item>
  );
}

export default SearchStep;
