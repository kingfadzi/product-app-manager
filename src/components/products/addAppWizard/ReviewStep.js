import React from 'react';
import { Table, Alert } from 'react-bootstrap';
import { useAddAppWizard } from './AddAppWizardContext';
import ApplicationReviewRows from './ApplicationReviewRows';
import ProductReviewRow from './ProductReviewRow';
import InstancesReviewRow from './InstancesReviewRow';
import ReposReviewRow from './ReposReviewRow';
import JiraReviewRow from './JiraReviewRow';
import DocsReviewRow from './DocsReviewRow';

function ReviewStep() {
  const {
    selectedApp,
    selectedProduct,
    serviceInstances,
    addedDocs,
    getAllSelectedRepos,
    getAllSelectedJira
  } = useAddAppWizard();

  const allRepos = getAllSelectedRepos();
  const allJira = getAllSelectedJira();
  const isAddingToProduct = selectedApp?.isOnboarded;

  return (
    <>
      <Table bordered size="sm">
        <tbody>
          <ApplicationReviewRows app={selectedApp} />
          <ProductReviewRow product={selectedProduct} />
          {!isAddingToProduct && (
            <>
              <InstancesReviewRow instances={serviceInstances} />
              <ReposReviewRow repos={allRepos} />
              <JiraReviewRow projects={allJira} />
              <DocsReviewRow docs={addedDocs} />
            </>
          )}
        </tbody>
      </Table>

      <Alert variant="info" className="small mb-0">
        {isAddingToProduct
          ? 'Review above. Click "Add to Product" to add this application to the selected product.'
          : 'Review your selections above. Click "Add Application" to complete onboarding.'}
      </Alert>
    </>
  );
}

export default ReviewStep;
