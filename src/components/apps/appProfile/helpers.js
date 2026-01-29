export function formatShortDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('en', { month: 'short' });
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${hours}:${mins}`;
}

export function getHealthColor(health) {
  switch (health) {
    case 'Green': return '#28a745';
    case 'Amber': return '#ffc107';
    case 'Red': return '#dc3545';
    default: return '#6c757d';
  }
}

export function getResCatBadgeClass(resCat) {
  switch (resCat) {
    case 'Critical': return 'danger';
    case 'High': return 'warning';
    case 'Medium': return 'info';
    default: return 'secondary';
  }
}

const CONTACT_ROLE_LABELS = {
  product_owner: 'Product Owner',
  tech_lead: 'Tech Lead',
  scrum_master: 'Scrum Master',
  support_lead: 'Support Lead',
};

export function getContactRoleLabel(role) {
  return CONTACT_ROLE_LABELS[role] || role;
}

const GUILD_ROLE_LABELS = {
  security: 'Security',
  data: 'Data',
  operations: 'Operations',
  enterprise_architecture: 'Enterprise Architecture',
};

export function getGuildRoleLabel(role) {
  return GUILD_ROLE_LABELS[role] || role;
}
