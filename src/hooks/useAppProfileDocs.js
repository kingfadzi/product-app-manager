import { useCallback } from 'react';

function useAppProfileDocs({ appId, createDoc, deleteDoc, setDocs, setError }) {
  const addDoc = useCallback(async (docData) => {
    try {
      const created = await createDoc(appId, docData);
      setDocs(prev => [...prev, created]);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to add documentation.');
      throw err;
    }
  }, [appId, createDoc, setDocs, setError]);

  const removeDoc = useCallback(async (docId) => {
    try {
      await deleteDoc(docId);
      setDocs(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      setError(err.message || 'Failed to remove documentation.');
      throw err;
    }
  }, [deleteDoc, setDocs, setError]);

  return { addDoc, removeDoc };
}

export default useAppProfileDocs;
