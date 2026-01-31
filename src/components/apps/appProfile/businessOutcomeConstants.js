/**
 * Constants and helpers for BusinessOutcome components
 */

export const INITIAL_WIZARD_DATA = {
  productDeltaDoc: '',
  architectureDeltaDoc: '',
  serviceVisionDeltaDoc: '',
  questionnaire: {
    impactsData: '',
    impactsSecurity: '',
    impactsAccessibility: '',
    requiresArchReview: '',
    deploymentStrategy: ''
  },
  selectedGuilds: []
};

export function isGuildRecommended(guild, questionnaire) {
  if (guild === 'Data' && questionnaire.impactsData === 'yes') return true;
  if (guild === 'Security' && questionnaire.impactsSecurity === 'yes') return true;
  if (guild === 'Accessibility' && questionnaire.impactsAccessibility === 'yes') return true;
  if (guild === 'Ent. Architecture' && questionnaire.requiresArchReview === 'yes') return true;
  if (guild === 'Srv. Transition' && questionnaire.deploymentStrategy) return true;
  return false;
}

export function formatYesNo(val) {
  if (val === 'yes') return 'Yes';
  if (val === 'no') return 'No';
  return '—';
}

export function formatDeploymentStrategy(val) {
  if (val === 'standard') return 'Standard Release';
  if (val === 'hotfix') return 'Hotfix';
  if (val === 'feature-flag') return 'Feature Flag';
  return '—';
}
