import productsData from './data/products.json';
import appsData from './data/apps.json';
import productAppsData from './data/productApps.json';
import reposData from './data/repos.json';
import backlogsData from './data/backlogs.json';
import contactsData from './data/contacts.json';
import docsData from './data/docs.json';
import portfoliosData from './data/portfolios.json';
import serviceInstancesData from './data/serviceInstances.json';
import availableReposData from './data/availableRepos.json';
import availableJiraData from './data/availableJira.json';
import allReposData from './data/allRepos.json';
import allJiraData from './data/allJira.json';
import outcomeEngagementsData from './data/outcomeEngagements.json';
import transactionCyclesData from './data/transactionCycles.json';
import cmdbAppsData from './data/cmdbApps.json';
import riskStoriesData from './data/riskStories.json';
import businessOutcomesData from './data/businessOutcomes.json';
import controlSmesData from './data/controlSmes.json';
import fixVersionsData from './data/fixVersions.json';
import deploymentEnvironmentsData from './data/deploymentEnvironments.json';
import guildsData from './data/guilds.json';

export const store = {
  products: [...productsData],
  apps: [...appsData],
  productApps: [...productAppsData],
  repos: [...reposData],
  backlogs: [...backlogsData],
  contacts: [...contactsData],
  docs: [...docsData],
  portfolios: [...portfoliosData],
  serviceInstances: { ...serviceInstancesData },
  availableRepos: { ...availableReposData },
  availableJira: { ...availableJiraData },
  allRepos: [...allReposData],
  allJira: [...allJiraData],
  outcomeEngagements: { ...outcomeEngagementsData },
  transactionCycles: [...transactionCyclesData],
  cmdbApps: [...cmdbAppsData],
  riskStories: { ...riskStoriesData },
  businessOutcomes: { ...businessOutcomesData },
  controlSmes: { ...controlSmesData },
  fixVersions: { ...fixVersionsData },
  deploymentEnvironments: [...deploymentEnvironmentsData],
  guilds: [...guildsData],
  deployments: [],
};
