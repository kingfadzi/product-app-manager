import { useCallback, useState } from 'react';

function useDocsSelection() {
  const [addedDocs, setAddedDocs] = useState([]);

  const addDoc = useCallback((type, url) => {
    if (!type || !url) return;
    setAddedDocs((prev) => [...prev, { type, url }]);
  }, []);

  const removeDoc = useCallback((type) => {
    setAddedDocs((prev) => prev.filter((doc) => doc.type !== type));
  }, []);

  return { addedDocs, addDoc, removeDoc, setAddedDocs };
}

export default useDocsSelection;
