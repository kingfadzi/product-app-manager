import React from 'react';
import StepIndicator from '../../common/StepIndicator';
import { BUSINESS_OUTCOME_STEPS, StepDetails, StepChanges, StepQuestionnaire, StepRequest } from './businessOutcomeSteps';

function BusinessOutcomeWizard({ outcome, wizardData, setWizardData, wizardStep, guildSmes, toggleGuild }) {
  return (
    <>
      <StepIndicator steps={BUSINESS_OUTCOME_STEPS} currentStep={wizardStep} />
      {wizardStep === 1 && <StepDetails outcome={outcome} />}
      {wizardStep === 2 && <StepChanges wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 3 && <StepQuestionnaire wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 4 && <StepRequest wizardData={wizardData} guildSmes={guildSmes} toggleGuild={toggleGuild} />}
    </>
  );
}

export default BusinessOutcomeWizard;
