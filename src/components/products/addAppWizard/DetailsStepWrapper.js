import React from 'react';
import { useAddAppWizard } from './AddAppWizardContext';
import DetailsStep from './DetailsStep';
import WizardNavButtons from './WizardNavButtons';

function DetailsStepWrapper(props) {
  const { handleClose } = useAddAppWizard();
  return (
    <div>
      <DetailsStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
      />
    </div>
  );
}

export default DetailsStepWrapper;
