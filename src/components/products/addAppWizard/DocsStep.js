import React from 'react';
import RemediationBox from '../../common/RemediationBox';
import { useAddAppWizard } from './AddAppWizardContext';
import { DOC_TYPES } from './constants';
import AddedDocsTable from './AddedDocsTable';
import DocInputSection from './DocInputSection';
import DocStatus from './DocStatus';

function DocsStep() {
  const { addedDocs, addDoc, removeDoc } = useAddAppWizard();

  const addedTypes = addedDocs.map(d => d.type);
  const availableTypes = DOC_TYPES.filter(t => !addedTypes.includes(t));
  const missingTypes = availableTypes;

  return (
    <>
      <DocInputSection availableTypes={availableTypes} onAdd={addDoc} />

      {addedDocs.length > 0 && (
        <AddedDocsTable docs={addedDocs} onRemove={removeDoc} />
      )}

      <DocStatus missingTypes={missingTypes} />

      <RemediationBox
        dataSource="Documentation is managed in Confluence."
        contactEmail="documentation-team@example.com"
        linkUrl="https://confluence.example.com"
        linkText="Open Confluence"
      />
    </>
  );
}

export default DocsStep;
