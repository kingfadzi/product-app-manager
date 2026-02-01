import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { formatShortDate } from './helpers';

function RiskStoriesTab({ stories = [], onViewMore, onItemClick }) {
  const items = Array.isArray(stories) ? stories : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">No risk stories available</p>;
  }
  return (
    <>
      <Table size="sm" className="mb-0" borderless>
        <tbody>
          {items.slice(0, 2).map(item => (
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

export default RiskStoriesTab;
