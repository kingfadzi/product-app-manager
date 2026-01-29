import { RESCAT_COLORS, ENVIRONMENT_COLORS } from '../../../constants/badges';

export function getResCatBadgeColor(resCat) {
  return RESCAT_COLORS[resCat] || 'secondary';
}

export function getEnvBadgeColor(env) {
  return ENVIRONMENT_COLORS[env] || 'secondary';
}

export function getRepoTypeBadgeColor(type) {
  return type === 'GitLab' ? 'success' : 'primary';
}

export function getTierBadgeColor(tier) {
  switch (tier) {
    case 'Gold': return 'warning';
    case 'Silver': return 'secondary';
    default: return 'info';
  }
}
