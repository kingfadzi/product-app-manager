import React from 'react';
import RemediationBox from '../../common/RemediationBox';
import { useAddAppWizard } from './AddAppWizardContext';
import AvailableReposTable from './AvailableReposTable';
import ManualReposTable from './ManualReposTable';
import RepoLookupSection from './RepoLookupSection';
import RepoSummary from './RepoSummary';

function ReposStep() {
  const {
    availableRepos,
    selectedRepos,
    manualRepos,
    totalSelectedRepos,
    toggleRepo,
    selectAllRepos,
    addManualRepo,
    removeManualRepo,
    getAllSelectedRepos
  } = useAddAppWizard();

  const allSelectedRepos = getAllSelectedRepos();
  const bitbucketSelected = allSelectedRepos.some(r => r?.type === 'BitBucket');

  return (
    <>
      <RepoLookupSection onAdd={addManualRepo} />

      {availableRepos.length > 0 && (
        <AvailableReposTable
          repos={availableRepos}
          selectedRepos={selectedRepos}
          onToggle={toggleRepo}
          onSelectAll={selectAllRepos}
        />
      )}

      {manualRepos.length > 0 && (
        <ManualReposTable repos={manualRepos} onRemove={removeManualRepo} />
      )}

      <RepoSummary
        totalSelected={totalSelectedRepos}
        bitbucketSelected={bitbucketSelected}
      />

      <RemediationBox
        dataSource="Repository mappings are managed by the DSI team."
        contactEmail="dsi-team@example.com"
        linkUrl="https://dsi.example.com/component-mapping"
        linkText="Open DSI Component Mapping"
      />
    </>
  );
}

export default ReposStep;
