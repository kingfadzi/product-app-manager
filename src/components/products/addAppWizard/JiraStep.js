import React from 'react';
import RemediationBox from '../../common/RemediationBox';
import { useAddAppWizard } from './AddAppWizardContext';
import AvailableJiraTable from './AvailableJiraTable';
import JiraLookupSection from './JiraLookupSection';
import JiraSummary from './JiraSummary';
import ManualJiraTable from './ManualJiraTable';

function JiraStep() {
  const {
    availableJira,
    selectedJira,
    manualJira,
    totalSelectedJira,
    toggleJira,
    selectAllJira,
    addManualJira,
    removeManualJira
  } = useAddAppWizard();

  return (
    <>
      <JiraLookupSection onAdd={addManualJira} />

      {availableJira.length > 0 && (
        <AvailableJiraTable
          projects={availableJira}
          selectedJira={selectedJira}
          onToggle={toggleJira}
          onSelectAll={selectAllJira}
        />
      )}

      {manualJira.length > 0 && (
        <ManualJiraTable projects={manualJira} onRemove={removeManualJira} />
      )}

      <JiraSummary totalSelected={totalSelectedJira} />

      <RemediationBox
        dataSource="Jira project mappings are managed by the DSI team."
        contactEmail="dsi-team@example.com"
        linkUrl="https://dsi.example.com/component-mapping"
        linkText="Open DSI Component Mapping"
      />
    </>
  );
}

export default JiraStep;
