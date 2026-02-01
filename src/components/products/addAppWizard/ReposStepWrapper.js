import React from 'react';
import { useAddAppWizard } from './AddAppWizardContext';
import ReposStep from './ReposStep';
import WizardNavButtons from './WizardNavButtons';

function ReposStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <ReposStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('repos')}
      />
    </div>
  );
}

export default ReposStepWrapper;
