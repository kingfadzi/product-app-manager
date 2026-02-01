import React from 'react';

function BlockedIndicator({ blocked }) {
  if (blocked) {
    return <span title="Blocked" style={{ color: '#dc3545' }}>&#x26D4;</span>;
  }
  return <span title="Not blocked" style={{ color: '#28a745' }}>&#x2713;</span>;
}

export default BlockedIndicator;
