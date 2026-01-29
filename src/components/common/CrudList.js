import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import { usePagination } from '../../hooks/usePagination';
import ConfirmModal from './ConfirmModal';
import EmptyState from './EmptyState';
import TablePagination from './TablePagination';

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
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await loadItems();
      setItems(data || []);
    } catch (error) {
      console.error(`Error loading ${itemLabel}:`, error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
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
    } catch (error) {
      console.error(`Error saving ${itemLabel}:`, error);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      try {
        await onDelete(deleteConfirm.id);
        await loadData();
      } catch (error) {
        console.error(`Error deleting ${itemLabel}:`, error);
      }
      setDeleteConfirm(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    totalItems,
    showPagination,
  } = usePagination(items, itemsPerPage);

  const getFormInitialValues = () => {
    if (editingItem) {
      const values = {};
      Object.keys(initialValues).forEach((key) => {
        values[key] = editingItem[key] !== undefined ? editingItem[key] : initialValues[key];
      });
      return values;
    }
    return initialValues;
  };

  if ((loading || isLoading) && items.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>{title}</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Add {title.replace(/s$/, '')}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={`Add ${title.replace(/s$/, '')}`}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.header}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  <td>
                    <Button variant="link" size="sm" onClick={() => handleEditClick(item)}>
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger"
                      onClick={() => setDeleteConfirm(item)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {showPagination && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              size="sm"
              showInfo={false}
              itemLabel={itemLabel}
            />
          )}
        </>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={getFormInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit}>
              <Modal.Body>
                {renderForm(formikProps)}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>

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
