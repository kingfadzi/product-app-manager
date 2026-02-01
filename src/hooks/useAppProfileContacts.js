import { useCallback } from 'react';

function useAppProfileContacts({ appId, createContact, deleteContact, setContacts, setError }) {
  const addContact = useCallback(async (contactData) => {
    try {
      const result = await createContact(appId, contactData);
      const newContact = {
        id: result.stakeholder_id,
        name: contactData.name,
        email: contactData.email,
        role: contactData.role,
      };
      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (err) {
      setError(err.message || 'Failed to add contact.');
      throw err;
    }
  }, [appId, createContact, setContacts, setError]);

  const removeContact = useCallback(async (contactId) => {
    try {
      await deleteContact(appId, contactId);
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (err) {
      setError(err.message || 'Failed to remove contact.');
      throw err;
    }
  }, [appId, deleteContact, setContacts, setError]);

  return { addContact, removeContact };
}

export default useAppProfileContacts;
