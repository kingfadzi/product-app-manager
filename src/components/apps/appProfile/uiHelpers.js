import React from 'react';
import { getHealthColor } from './helpers';

export function HealthIndicator({ health }) {
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

export function BlockedIndicator({ blocked }) {
  if (blocked) {
    return <span title="Blocked" style={{ color: '#dc3545' }}>&#x26D4;</span>;
  }
  return <span title="Not blocked" style={{ color: '#28a745' }}>&#x2713;</span>;
}

export function DetailRow({ label, value }) {
  return (
    <div className="mb-1 d-flex">
      <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
