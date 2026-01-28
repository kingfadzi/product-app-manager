import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';

const backlogSchema = Yup.object().shape({
  projectKey: Yup.string().required('Project key is required'),
  projectName: Yup.string().required('Project name is required'),
  purpose: Yup.string().oneOf(['product', 'ops', 'security']).required('Purpose is required'),
  isPrimary: Yup.boolean(),
});

function BacklogList({ appId }) {
  const { getAppBacklogs, createBacklog, updateBacklog, deleteBacklog, loading } = useApps();
  const [backlogs, setBacklogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBacklog, setEditingBacklog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadBacklogs();
  }, [appId]);

  const loadBacklogs = async () => {
    const data = await getAppBacklogs(appId);
    setBacklogs(data);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (editingBacklog) {
      await updateBacklog(editingBacklog.id, values);
    } else {
      await createBacklog(appId, values);
    }
    await loadBacklogs();
    setShowModal(false);
    setEditingBacklog(null);
    resetForm();
  };

  const handleEdit = (backlog) => {
    setEditingBacklog(backlog);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteBacklog(deleteConfirm.id);
      await loadBacklogs();
      setDeleteConfirm(null);
    }
  };

  const purposeColors = {
    product: 'primary',
    ops: 'warning',
    security: 'danger',
  };

  if (loading && backlogs.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Backlogs</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Add Backlog
        </Button>
      </div>

      {backlogs.length === 0 ? (
        <EmptyState
          title="No backlogs"
          description="Add project backlogs linked to this app."
          actionLabel="Add Backlog"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Project</th>
              <th>Purpose</th>
              <th>Primary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {backlogs.map(backlog => (
              <tr key={backlog.id}>
                <td>
                  <div><strong>{backlog.projectKey}</strong></div>
                  <small className="text-muted">{backlog.projectName}</small>
                </td>
                <td>
                  <Badge variant={purposeColors[backlog.purpose]}>{backlog.purpose}</Badge>
                </td>
                <td>{backlog.isPrimary ? 'Yes' : 'No'}</td>
                <td>
                  <Button variant="link" size="sm" onClick={() => handleEdit(backlog)}>
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger"
                    onClick={() => setDeleteConfirm(backlog)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingBacklog(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingBacklog ? 'Edit Backlog' : 'Add Backlog'}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            projectKey: editingBacklog?.projectKey || '',
            projectName: editingBacklog?.projectName || '',
            purpose: editingBacklog?.purpose || 'product',
            isPrimary: editingBacklog?.isPrimary || false,
          }}
          validationSchema={backlogSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Project Key</Form.Label>
                  <Form.Control
                    name="projectKey"
                    value={values.projectKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.projectKey && errors.projectKey}
                    placeholder="PROJ"
                  />
                  <Form.Control.Feedback type="invalid">{errors.projectKey}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    name="projectName"
                    value={values.projectName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.projectName && errors.projectName}
                    placeholder="Project Name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.projectName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control
                    as="select"
                    name="purpose"
                    value={values.purpose}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="product">Product</option>
                    <option value="ops">Operations</option>
                    <option value="security">Security</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isPrimary"
                    label="Primary Backlog"
                    checked={values.isPrimary}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowModal(false); setEditingBacklog(null); }}>
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
        onConfirm={handleDelete}
        title="Delete Backlog"
        message={`Are you sure you want to delete "${deleteConfirm?.projectKey}"?`}
      />
    </div>
  );
}

export default BacklogList;
