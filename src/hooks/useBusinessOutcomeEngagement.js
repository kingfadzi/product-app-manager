import { useCallback, useEffect, useState } from 'react';
import { outcomesApi } from '../services/api';
import { INITIAL_WIZARD_DATA } from '../components/apps/appProfile/businessOutcomeConstants';

function normalizeEngagementData(data) {
  if (!data) return INITIAL_WIZARD_DATA;
  return {
    productDeltaDoc: data.productDeltaDoc || data.product_delta_doc || '',
    architectureDeltaDoc: data.architectureDeltaDoc || data.architecture_delta_doc || '',
    serviceVisionDeltaDoc: data.serviceVisionDeltaDoc || data.service_vision_delta_doc || '',
    questionnaire: data.questionnaire || INITIAL_WIZARD_DATA.questionnaire,
    selectedGuilds: data.selectedGuilds || data.selected_guilds || [],
  };
}

function useBusinessOutcomeEngagement({ outcomeId, enabled }) {
  const [wizardData, setWizardData] = useState(INITIAL_WIZARD_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!outcomeId) return;
    setLoading(true);
    setError(null);
    try {
      const savedData = await outcomesApi.getEngagement(outcomeId);
      setWizardData(normalizeEngagementData(savedData));
    } catch (err) {
      setWizardData(INITIAL_WIZARD_DATA);
      setError(err.message || 'Failed to load engagement data.');
    } finally {
      setLoading(false);
    }
  }, [outcomeId]);

  const save = useCallback(async (data) => {
    if (!outcomeId) return false;
    setError(null);
    try {
      await outcomesApi.saveEngagement(outcomeId, data);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to save engagement data.');
      return false;
    }
  }, [outcomeId]);

  const reset = useCallback(() => {
    setWizardData(INITIAL_WIZARD_DATA);
    setError(null);
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return {
    wizardData,
    setWizardData,
    loading,
    error,
    load,
    save,
    reset,
  };
}

export default useBusinessOutcomeEngagement;
