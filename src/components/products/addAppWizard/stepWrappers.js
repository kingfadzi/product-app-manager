import React from 'react';
import { Button } from 'react-bootstrap';
import { useAddAppWizard } from './AddAppWizardContext';
import { STEP_INDICES } from './stepIndices';
import SearchStep from './SearchStep';
import ProductStep from './ProductStep';
import DetailsStep from './DetailsStep';
import InstancesStep from './InstancesStep';
import ReposStep from './ReposStep';
import JiraStep from './JiraStep';
import DocsStep from './DocsStep';
import ReviewStep from './ReviewStep';
import ResultStep from './ResultStep';

function WizardNavButtons({ onCancel, onBack, onNext, showBack, showNext, canProceed = true }) {
  return (
    <div className="d-flex justify-content-between mt-4">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <div>
        {showBack && (
          <Button variant="outline-secondary" onClick={onBack} style={{ marginRight: '0.5rem' }}>
            Back
          </Button>
        )}
        {showNext && (
          <Button variant="primary" onClick={onNext} disabled={!canProceed}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

export function SearchStepWrapper(props) {
  const { selectApp } = useAddAppWizard();
  const handleSelect = (app) => {
    selectApp(app);
    props.nextStep();
  };
  return <SearchStep onSelect={handleSelect} />;
}

export function ProductStepWrapper(props) {
  const { selectProduct, selectedApp, handleClose } = useAddAppWizard();
  const isAddingToProduct = selectedApp?.isOnboarded;
  const handleSelect = (product) => {
    selectProduct(product);
    if (isAddingToProduct) {
      props.goToStep(STEP_INDICES.REVIEW);
    } else {
      props.nextStep();
    }
  };
  return (
    <div>
      <ProductStep onSelect={handleSelect} />
      <WizardNavButtons onCancel={handleClose} onBack={props.previousStep} showBack={true} />
    </div>
  );
}

export function DetailsStepWrapper(props) {
  const { handleClose } = useAddAppWizard();
  return (
    <div>
      <DetailsStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
      />
    </div>
  );
}

export function InstancesStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <InstancesStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('instances')}
      />
    </div>
  );
}

export function ReposStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <ReposStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('repos')}
      />
    </div>
  );
}

export function JiraStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <JiraStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('jira')}
      />
    </div>
  );
}

export function DocsStepWrapper(props) {
  const { canProceed, handleClose } = useAddAppWizard();
  return (
    <div>
      <DocsStep />
      <WizardNavButtons
        onCancel={handleClose}
        onBack={props.previousStep}
        onNext={props.nextStep}
        showBack={true}
        showNext={true}
        canProceed={canProceed('docs')}
      />
    </div>
  );
}

export function ReviewStepWrapper(props) {
  const { finish, handleClose, selectedApp } = useAddAppWizard();
  const isAddingToProduct = selectedApp?.isOnboarded;
  const handleBack = () => {
    if (isAddingToProduct) {
      props.goToStep(STEP_INDICES.PRODUCT);
    } else {
      props.previousStep();
    }
  };
  const handleSubmit = async () => {
    await finish();
    props.nextStep();
  };
  return (
    <div>
      <ReviewStep />
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <div>
          <Button variant="outline-secondary" onClick={handleBack} style={{ marginRight: '0.5rem' }}>
            Back
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {isAddingToProduct ? 'Add to Product' : 'Add Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ResultStepWrapper(props) {
  const { handleClose, submitError } = useAddAppWizard();
  const handleBack = () => props.previousStep();
  return (
    <div>
      <ResultStep />
      <div className="d-flex justify-content-between mt-4">
        <div>
          {submitError && (
            <Button variant="outline-secondary" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
