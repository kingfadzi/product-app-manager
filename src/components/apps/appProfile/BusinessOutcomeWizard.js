import React from 'react';
import StepIndicator from '../../common/StepIndicator';
import { BUSINESS_OUTCOME_STEPS } from './businessOutcomeSteps';
import BusinessOutcomeStepDetails from './BusinessOutcomeStepDetails';
import BusinessOutcomeStepChanges from './BusinessOutcomeStepChanges';
import BusinessOutcomeStepQuestionnaire from './BusinessOutcomeStepQuestionnaire';
import BusinessOutcomeStepRequest from './BusinessOutcomeStepRequest';

/**
 * Edit/Wizard mode for BusinessOutcomeModal
 * Multi-step wizard for guild engagement
 */
function BusinessOutcomeWizard({ outcome, wizardData, setWizardData, wizardStep, guildSmes, toggleGuild }) {
  return (
    <>
      <StepIndicator steps={BUSINESS_OUTCOME_STEPS} currentStep={wizardStep} />
      {wizardStep === 1 && <BusinessOutcomeStepDetails outcome={outcome} />}
      {wizardStep === 2 && <BusinessOutcomeStepChanges wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 3 && <BusinessOutcomeStepQuestionnaire wizardData={wizardData} setWizardData={setWizardData} />}
      {wizardStep === 4 && <BusinessOutcomeStepRequest wizardData={wizardData} guildSmes={guildSmes} toggleGuild={toggleGuild} />}
    </>
  );
}

export default BusinessOutcomeWizard;
