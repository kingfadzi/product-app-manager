import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import WizardNav from './WizardNav';
import WizardStep from './WizardStep';

function WizardContainer({ steps, onComplete, initialData = {} }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);

  const handleNext = (stepData) => {
    const newData = { ...data, ...stepData };
    setData(newData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index) => {
    if (index < currentStep) {
      setCurrentStep(index);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Card>
      <Card.Header>
        <WizardNav
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </Card.Header>
      <Card.Body>
        <WizardStep title={steps[currentStep].title}>
          <CurrentStepComponent
            data={data}
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
          />
        </WizardStep>
      </Card.Body>
    </Card>
  );
}

export default WizardContainer;
