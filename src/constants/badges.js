// Shared color and badge mappings for consistency across the application

export const RESCAT_COLORS = {
  Critical: 'danger',
  High: 'warning',
  Medium: 'info',
  Low: 'secondary',
};

export const ENVIRONMENT_COLORS = {
  Prod: 'success',
  DR: 'danger',
  UAT: 'warning',
  Dev: 'info',
};

export const TIER_COLORS = {
  gold: 'warning',
  silver: 'secondary',
  bronze: 'info',
};

export const STATUS_COLORS = {
  active: 'success',
  maintenance: 'warning',
  deprecated: 'danger',
};

export const REPO_ROLE_COLORS = {
  backend: 'primary',
  frontend: 'success',
  infra: 'warning',
  docs: 'info',
};

export const BACKLOG_PURPOSE_COLORS = {
  product: 'primary',
  ops: 'warning',
  security: 'danger',
};

export const CONTACT_ROLE_COLORS = {
  product_owner: 'primary',
  tech_lead: 'success',
  business_owner: 'warning',
  sme: 'info',
};

export const CONTACT_ROLE_LABELS = {
  product_owner: 'Product Owner',
  tech_lead: 'Tech Lead',
  business_owner: 'Business Owner',
  sme: 'SME',
};

export const DOC_TYPE_COLORS = {
  roadmap: 'primary',
  vision: 'success',
  architecture: 'warning',
  runbook: 'info',
};

export const RISK_STATUS_COLORS = {
  Open: 'danger',
  'In Progress': 'warning',
  Resolved: 'success',
};

export const OUTCOME_STATUS_COLORS = {
  'On Track': 'success',
  'At Risk': 'warning',
  Completed: 'info',
};

export const GUILD_HEALTH_COLORS = {
  Green: 'success',
  Amber: 'warning',
  Red: 'danger',
};

// Helper function to get color with fallback
export const getColor = (colorMap, key, fallback = 'secondary') => {
  return colorMap[key] || fallback;
};
