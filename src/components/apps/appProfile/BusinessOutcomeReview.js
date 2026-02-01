import React from 'react';
import BusinessOutcomeDetailsCard from './BusinessOutcomeDetailsCard';
import BusinessOutcomeDeltaDocCard from './BusinessOutcomeDeltaDocCard';
import BusinessOutcomeGuildAssessmentCard from './BusinessOutcomeGuildAssessmentCard';
import BusinessOutcomeAssignedGuildsCard from './BusinessOutcomeAssignedGuildsCard';

/**
 * Review mode for BusinessOutcomeModal
 * Displays outcome details, delta docs, assessment, and assigned guilds
 */
function BusinessOutcomeReview({ outcome, wizardData, guildSmes }) {
  return (
    <div>
      <BusinessOutcomeDetailsCard outcome={outcome} />
      <BusinessOutcomeDeltaDocCard wizardData={wizardData} />
      <BusinessOutcomeGuildAssessmentCard wizardData={wizardData} />
      <BusinessOutcomeAssignedGuildsCard wizardData={wizardData} guildSmes={guildSmes} />
    </div>
  );
}

export default BusinessOutcomeReview;
