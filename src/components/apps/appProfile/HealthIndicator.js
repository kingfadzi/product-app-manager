import React from 'react';
import { getHealthColor } from './helpers';

function HealthIndicator({ health }) {
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

export default HealthIndicator;
