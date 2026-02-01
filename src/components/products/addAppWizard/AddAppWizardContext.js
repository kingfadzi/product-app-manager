import React, { createContext, useContext } from 'react';
import useAddAppWizardState from '../../../hooks/useAddAppWizardState';

const AddAppWizardContext = createContext(null);

export function AddAppWizardProvider({ children, onComplete, onClose }) {
  const value = useAddAppWizardState({ onComplete, onClose });

  return (
    <AddAppWizardContext.Provider value={value}>
      {children}
    </AddAppWizardContext.Provider>
  );
}

export function useAddAppWizard() {
  const context = useContext(AddAppWizardContext);
  if (!context) {
    throw new Error('useAddAppWizard must be used within AddAppWizardProvider');
  }
  return context;
}
