import React from 'react';

/**
 * Reusable step indicator component for wizard flows
 * @param {Object} props
 * @param {string[]} props.steps - Array of step identifiers
 * @param {string|number} props.currentStep - Current step (string ID or 1-indexed number)
 * @param {Object} props.labels - Optional map of step ID to display label
 * @param {Function} props.onStepClick - Optional callback when a completed step is clicked
 */
function StepIndicator({ steps, currentStep, labels, onStepClick }) {
  const currentIndex = typeof currentStep === 'string'
    ? steps.indexOf(currentStep)
    : currentStep - 1;

  const getStepLabel = (step, idx) => {
    if (labels && labels[step]) return labels[step];
    return step;
  };

  const isCompleted = (idx) => idx < currentIndex;
  const isCurrent = (idx) => idx === currentIndex;
  const isClickable = (idx) => isCompleted(idx) && onStepClick;

  const handleClick = (step, idx) => {
    if (isClickable(idx)) {
      onStepClick(step);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div
            className="text-center"
            style={{ cursor: isClickable(idx) ? 'pointer' : 'default' }}
            onClick={() => handleClick(step, idx)}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isCurrent(idx) ? '#212529' : isCompleted(idx) ? '#22c55e' : '#e9ecef',
                color: isCurrent(idx) || isCompleted(idx) ? '#fff' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                margin: '0 auto 0.25rem'
              }}
            >
              {isCompleted(idx) ? '\u2713' : idx + 1}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{getStepLabel(step, idx)}</div>
          </div>
          {idx < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: '2px',
                background: isCompleted(idx) ? '#22c55e' : '#e9ecef',
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
