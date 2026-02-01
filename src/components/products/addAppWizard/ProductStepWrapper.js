import React from 'react';
import { useAddAppWizard } from './AddAppWizardContext';
import ProductStep from './ProductStep';
import WizardNavButtons from './WizardNavButtons';
import { STEP_INDICES } from './stepIndices';

function ProductStepWrapper(props) {
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

export default ProductStepWrapper;
