import React from 'react';
import { useAddAppWizard } from './AddAppWizardContext';
import JiraStep from './JiraStep';
import WizardNavButtons from './WizardNavButtons';

function JiraStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <JiraStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('jira')}
      />
    </div>
  );
}

export default JiraStepWrapper;
