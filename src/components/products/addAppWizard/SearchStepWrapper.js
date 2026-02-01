import React from 'react';
import { useAddAppWizard } from './AddAppWizardContext';
import SearchStep from './SearchStep';

function SearchStepWrapper(props) {
  const { selectApp } = useAddAppWizard();
  const handleSelect = (app) => {
    selectApp(app);
    props.nextStep();
  };
  return <SearchStep onSelect={handleSelect} />;
}

export default SearchStepWrapper;
