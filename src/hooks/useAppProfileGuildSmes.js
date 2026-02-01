import { useCallback } from 'react';
import { guildSmesApi } from '../services/api';

function useAppProfileGuildSmes({ appId, setGuildSmes, setError }) {
  const addGuildSme = useCallback(async (smeData) => {
    try {
      const result = await guildSmesApi.create(appId, smeData);
      const newSme = {
        id: result.stakeholder_id,
        name: smeData.name,
        email: smeData.email,
        role: smeData.role,
      };
      setGuildSmes(prev => [...prev, newSme]);
      return newSme;
    } catch (err) {
      setError(err.message || 'Failed to add guild SME.');
      throw err;
    }
  }, [appId, setGuildSmes, setError]);

  const removeGuildSme = useCallback(async (smeId) => {
    try {
      await guildSmesApi.delete(appId, smeId);
      setGuildSmes(prev => prev.filter(s => s.id !== smeId));
    } catch (err) {
      setError(err.message || 'Failed to remove guild SME.');
      throw err;
    }
  }, [appId, setGuildSmes, setError]);

  return { addGuildSme, removeGuildSme };
}

export default useAppProfileGuildSmes;
