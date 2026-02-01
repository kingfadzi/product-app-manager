import { appsHandlers } from './handlers/appsHandlers';
import { backlogsHandlers } from './handlers/backlogsHandlers';
import { contactsHandlers } from './handlers/contactsHandlers';
import { docsHandlers } from './handlers/docsHandlers';
import { deploymentsHandlers } from './handlers/deploymentsHandlers';
import { governanceHandlers } from './handlers/governanceHandlers';
import { miscHandlers } from './handlers/miscHandlers';
import { productsHandlers } from './handlers/productsHandlers';
import { reposHandlers } from './handlers/reposHandlers';

export const handlers = [
  ...productsHandlers,
  ...appsHandlers,
  ...reposHandlers,
  ...backlogsHandlers,
  ...contactsHandlers,
  ...docsHandlers,
  ...miscHandlers,
  ...governanceHandlers,
  ...deploymentsHandlers,
];
