import React from 'react';

function WizardStep({ children }) {
  return (
    <div className="wizard-step">
      {children}
    </div>
  );
}

export default WizardStep;
