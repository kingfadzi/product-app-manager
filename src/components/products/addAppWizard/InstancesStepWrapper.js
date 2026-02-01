import React from 'react';
import { useAddAppWizard } from './AddAppWizardContext';
import InstancesStep from './InstancesStep';
import WizardNavButtons from './WizardNavButtons';

function InstancesStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <InstancesStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('instances')}
      />
    </div>
  );
}

export default InstancesStepWrapper;
