import { useCallback, useState } from 'react';

function useWizardSubmission({
  onComplete,
  selectedApp,
  selectedProduct,
  getAllSelectedRepos,
  getAllSelectedJira,
  addedDocs,
}) {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitWarnings, setSubmitWarnings] = useState([]);

  const resetSubmission = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitWarnings([]);
  }, []);

  const finish = useCallback(async () => {
    resetSubmission();
    try {
      const result = await onComplete([selectedApp], {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        repos: getAllSelectedRepos(),
        jiraProjects: getAllSelectedJira(),
        documentation: addedDocs,
      });
      const warnings = result?.warnings || [];
      if (warnings.length > 0) setSubmitWarnings(warnings);
      setSubmitSuccess(true);
      return true;
    } catch (err) {
      setSubmitError(err.message || 'Failed to add application. Please try again.');
      return false;
    }
  }, [addedDocs, getAllSelectedJira, getAllSelectedRepos, onComplete, selectedApp, selectedProduct, resetSubmission]);

  return { submitError, submitSuccess, submitWarnings, finish, resetSubmission };
}

export default useWizardSubmission;
