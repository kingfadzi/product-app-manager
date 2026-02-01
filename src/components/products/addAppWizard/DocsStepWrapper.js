import React from 'react';
import { useAddAppWizard } from './AddAppWizardContext';
import DocsStep from './DocsStep';
import WizardNavButtons from './WizardNavButtons';

function DocsStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <DocsStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('docs')}
      />
    </div>
  );
}

export default DocsStepWrapper;
