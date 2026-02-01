import React from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { usePagination } from '../../hooks/usePagination';
import ConfirmModal from './ConfirmModal';
import CrudListHeader from './CrudListHeader';
import CrudListModal from './CrudListModal';
import CrudListTable from './CrudListTable';
import useCrudListState from '../../hooks/useCrudListState';

/**
 * Generic CRUD List Component
 * Encapsulates the common pattern for CRUD list views with pagination, modals, and forms.
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.itemLabel - Label for items (e.g., "repos", "contacts")
 * @param {Function} props.loadItems - Async function to load items
 * @param {Function} props.onAdd - Async function to add an item
 * @param {Function} props.onEdit - Async function to edit an item
 * @param {Function} props.onDelete - Async function to delete an item
 * @param {Array} props.columns - Column definitions [{key, header, render}]
 * @param {Object} props.validationSchema - Yup validation schema
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.renderForm - Render function for form fields
 * @param {Function} props.getItemName - Function to get display name for delete confirmation
 * @param {string} props.emptyTitle - Title for empty state
 * @param {string} props.emptyDescription - Description for empty state
 * @param {number} [props.itemsPerPage=5] - Items per page
 * @param {boolean} [props.loading=false] - External loading state
 */
function CrudList({
  title,
  itemLabel,
  loadItems,
  onAdd,
  onEdit,
  onDelete,
  columns,
  validationSchema,
  initialValues,
  renderForm,
  getItemName,
  emptyTitle,
  emptyDescription,
  itemsPerPage = 5,
  loading = false,
}) {
  const {
    items,
    showModal,
    setShowModal,
    editingItem,
    setEditingItem,
    deleteConfirm,
    setDeleteConfirm,
    isLoading,
    error,
    handleSubmit,
    handleDeleteConfirm,
    getFormInitialValues,
  } = useCrudListState({
    loadItems,
    onAdd,
    onEdit,
    onDelete,
    initialValues,
    itemLabel,
  });

  const pagination = usePagination(items, itemsPerPage);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  if ((loading || isLoading) && items.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <CrudListHeader title={title} onAdd={() => setShowModal(true)} />

      {error && <Alert variant="danger">{error}</Alert>}

      <CrudListTable
        title={title}
        itemLabel={itemLabel}
        items={items}
        columns={columns}
        onEdit={handleEditClick}
        onDelete={setDeleteConfirm}
        pagination={pagination}
        onAdd={() => setShowModal(true)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />

      <CrudListModal
        title={title}
        show={showModal}
        onClose={() => { setShowModal(false); setEditingItem(null); }}
        onSubmit={handleSubmit}
        initialValues={getFormInitialValues()}
        validationSchema={validationSchema}
        renderForm={renderForm}
        editingItem={editingItem}
      />

      <ConfirmModal
        show={!!deleteConfirm}
        onHide={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${title.replace(/s$/, '')}`}
        message={`Are you sure you want to delete "${deleteConfirm ? getItemName(deleteConfirm) : ''}"?`}
      />
    </div>
  );
}

export default CrudList;
