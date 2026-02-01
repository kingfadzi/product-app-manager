import { useCallback, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { productsApi, reposApi, backlogsApi, docsApi, appsApi } from '../services/api';

/**
 * Hook for onboarding an app to a product.
 * Handles the full onboarding flow: add to product, save repos, jira, docs.
 *
 * @param {Object} options
 * @param {Function} options.onSuccess - Called after successful onboarding with the new app
 * @returns {Object} { onboardApp }
 */
export function useAppOnboarding({ onSuccess } = {}) {
  const { addApp } = useContext(AppContext);

  const saveRepos = async (appId, repos) => {
    const warnings = [];
    for (const repo of repos) {
      try {
        await reposApi.create(appId, {
          name: repo.name,
          url: repo.url,
          gitlabId: repo.repoId,
          defaultBranch: repo.defaultBranch || 'main',
          isMonorepo: false,
        });
      } catch (err) {
        warnings.push(`Repo "${repo.name || repo.repoId}" failed to save.`);
      }
    }
    return warnings;
  };

  const saveJiraProjects = async (appId, projects) => {
    const warnings = [];
    for (const jira of projects) {
      try {
        await backlogsApi.create(appId, {
          projectKey: jira.projectKey,
          projectName: jira.projectName,
          projectUrl: jira.url,
        });
      } catch (err) {
        warnings.push(`Jira project "${jira.projectKey}" failed to save.`);
      }
    }
    return warnings;
  };

  const saveDocs = async (appId, docs) => {
    const warnings = [];
    for (const doc of docs) {
      try {
        await docsApi.create(appId, {
          title: doc.type,
          url: doc.url,
          type: doc.type,
        });
      } catch (err) {
        warnings.push(`Documentation "${doc.type}" failed to save.`);
      }
    }
    return warnings;
  };

  const onboardApp = useCallback(async (selectedApps, metadata = {}) => {
    if (!selectedApps?.length) return;

    const app = selectedApps[0];
    const productId = metadata.productId;
    const cmdbId = app.cmdbId || app.id;

    // Add app to product - let errors propagate to caller
    const association = await productsApi.addApp(productId, cmdbId);
    const appId = association?.appId;
    const warnings = [];

    if (appId) {
      // Save related data (errors logged but don't fail the operation)
      if (metadata.repos?.length > 0) {
        warnings.push(...await saveRepos(appId, metadata.repos));
      }
      if (metadata.jiraProjects?.length > 0) {
        warnings.push(...await saveJiraProjects(appId, metadata.jiraProjects));
      }
      if (metadata.documentation?.length > 0) {
        warnings.push(...await saveDocs(appId, metadata.documentation));
      }

      // Fetch and add the new app to context
      try {
        const newApp = await appsApi.getById(cmdbId);
        if (newApp) {
          addApp(newApp);
          onSuccess?.(newApp);
        }
      } catch (err) {
        warnings.push('App was added but details failed to refresh.');
      }
    }

    return { association, warnings };
  }, [addApp, onSuccess]);

  return { onboardApp };
}
