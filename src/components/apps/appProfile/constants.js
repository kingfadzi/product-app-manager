// Must match backend CONTACT_ROLES in lean-web/services/stakeholder/repo.py
export const CONTACT_TYPES = [
  { value: 'product_owner', label: 'Product Owner' },
  { value: 'tech_lead', label: 'Tech Lead' },
  { value: 'scrum_master', label: 'Scrum Master' },
  { value: 'support_lead', label: 'Support Lead' },
];

// Must match backend GUILD_SME_ROLES in lean-web/services/stakeholder/repo.py
export const GUILD_SME_TYPES = [
  { value: 'security', label: 'Security' },
  { value: 'data', label: 'Data' },
  { value: 'operations', label: 'Operations' },
  { value: 'enterprise_architecture', label: 'Enterprise Architecture' },
];

export const ROLE_LABELS = {
  product_owner: 'Product Owner',
  tech_lead: 'Tech Lead',
  business_owner: 'Business Owner',
  sme: 'SME',
};
