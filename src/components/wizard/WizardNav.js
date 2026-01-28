import React from 'react';
import { Nav } from 'react-bootstrap';

function WizardNav({ steps, currentStep, onStepClick }) {
  return (
    <Nav variant="pills" className="justify-content-center">
      {steps.map((step, index) => (
        <Nav.Item key={step.key}>
          <Nav.Link
            active={index === currentStep}
            disabled={index > currentStep}
            onClick={() => onStepClick(index)}
            style={{ cursor: index < currentStep ? 'pointer' : 'default' }}
          >
            <span className="badge badge-pill mr-2" style={{
              backgroundColor: index <= currentStep ? '#007bff' : '#6c757d',
              color: 'white',
            }}>
              {index + 1}
            </span>
            {step.title}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default WizardNav;
