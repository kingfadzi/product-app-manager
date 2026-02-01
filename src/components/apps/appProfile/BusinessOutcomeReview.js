import React from 'react';
import { DetailsCard, DeltaDocCard, GuildAssessmentCard, AssignedGuildsCard } from './businessOutcomeCards';

function BusinessOutcomeReview({ outcome, wizardData, guildSmes }) {
  return (
    <div>
      <DetailsCard outcome={outcome} />
      <DeltaDocCard wizardData={wizardData} />
      <GuildAssessmentCard wizardData={wizardData} />
      <AssignedGuildsCard wizardData={wizardData} guildSmes={guildSmes} />
    </div>
  );
}

export default BusinessOutcomeReview;
