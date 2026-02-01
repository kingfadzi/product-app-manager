import { useCallback, useEffect, useState } from 'react';

function buildFormValues(initialValues, editingItem) {
  if (!editingItem) return initialValues;
  const values = {};
  Object.keys(initialValues).forEach((key) => {
    values[key] = editingItem[key] !== undefined ? editingItem[key] : initialValues[key];
  });
  return values;
}

function useCrudListState({ loadItems, onAdd, onEdit, onDelete, initialValues, itemLabel }) {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadItems();
      setItems(data || []);
    } catch (err) {
      setError(err.message || `Failed to load ${itemLabel}.`);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [itemLabel, loadItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = useCallback(async (values, { resetForm }) => {
    setError(null);
    try {
      if (editingItem) {
        await onEdit(editingItem.id, values);
      } else {
        await onAdd(values);
      }
      await loadData();
      setShowModal(false);
      setEditingItem(null);
      resetForm();
    } catch (err) {
      setError(err.message || `Failed to save ${itemLabel}.`);
    }
  }, [editingItem, itemLabel, loadData, onAdd, onEdit]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm) return;
    setError(null);
    try {
      await onDelete(deleteConfirm.id);
      await loadData();
    } catch (err) {
      setError(err.message || `Failed to delete ${itemLabel}.`);
    }
    setDeleteConfirm(null);
  }, [deleteConfirm, itemLabel, loadData, onDelete]);

  const getFormInitialValues = useCallback(
    () => buildFormValues(initialValues, editingItem),
    [initialValues, editingItem]
  );

  return {
    items,
    showModal,
    setShowModal,
    editingItem,
    setEditingItem,
    deleteConfirm,
    setDeleteConfirm,
    isLoading,
    error,
    setError,
    handleSubmit,
    handleDeleteConfirm,
    getFormInitialValues,
    loadData,
  };
}

export default useCrudListState;
