import React from 'react';

/**
 * Reusable step indicator component for wizard flows
 * @param {Object} props
 * @param {string[]} props.steps - Array of step labels
 * @param {number} props.currentStep - Current step (1-indexed)
 */
function StepIndicator({ steps, currentStep }) {
  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="text-center">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: currentStep === idx + 1 ? '#212529' : currentStep > idx + 1 ? '#22c55e' : '#e9ecef',
                color: currentStep >= idx + 1 ? '#fff' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                margin: '0 auto 0.25rem'
              }}
            >
              {currentStep > idx + 1 ? '\u2713' : idx + 1}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{step}</div>
          </div>
          {idx < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: '2px',
                background: currentStep > idx + 1 ? '#22c55e' : '#e9ecef',
                margin: '0 0.5rem',
                marginBottom: '1rem'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default StepIndicator;
