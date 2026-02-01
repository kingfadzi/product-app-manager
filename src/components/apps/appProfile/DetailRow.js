import React from 'react';

function DetailRow({ label, value }) {
  return (
    <div className="mb-1 d-flex">
      <span className="text-muted" style={{ width: '110px', whiteSpace: 'nowrap' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default DetailRow;
