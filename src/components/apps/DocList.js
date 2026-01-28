import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';

const docSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  url: Yup.string().url('Invalid URL').required('URL is required'),
  type: Yup.string().oneOf(['roadmap', 'vision', 'architecture', 'runbook']).required('Type is required'),
});

function DocList({ appId }) {
  const { getAppDocs, createDoc, updateDoc, deleteDoc, loading } = useApps();
  const [docs, setDocs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadDocs();
  }, [appId]);

  const loadDocs = async () => {
    const data = await getAppDocs(appId);
    setDocs(data);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (editingDoc) {
      await updateDoc(editingDoc.id, values);
    } else {
      await createDoc(appId, values);
    }
    await loadDocs();
    setShowModal(false);
    setEditingDoc(null);
    resetForm();
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteDoc(deleteConfirm.id);
      await loadDocs();
      setDeleteConfirm(null);
    }
  };

  const typeColors = {
    roadmap: 'primary',
    vision: 'success',
    architecture: 'warning',
    runbook: 'info',
  };

  if (loading && docs.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Documentation</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Add Document
        </Button>
      </div>

      {docs.length === 0 ? (
        <EmptyState
          title="No documents"
          description="Add documentation links for this app."
          actionLabel="Add Document"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map(doc => (
              <tr key={doc.id}>
                <td>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.title}
                  </a>
                </td>
                <td>
                  <Badge variant={typeColors[doc.type]}>{doc.type}</Badge>
                </td>
                <td>
                  <Button variant="link" size="sm" onClick={() => handleEdit(doc)}>
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger"
                    onClick={() => setDeleteConfirm(doc)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingDoc(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDoc ? 'Edit Document' : 'Add Document'}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            title: editingDoc?.title || '',
            url: editingDoc?.url || '',
            type: editingDoc?.type || 'architecture',
          }}
          validationSchema={docSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && errors.title}
                    placeholder="Document Title"
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="url"
                    value={values.url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.url && errors.url}
                    placeholder="https://confluence.example.com/doc"
                  />
                  <Form.Control.Feedback type="invalid">{errors.url}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="roadmap">Roadmap</option>
                    <option value="vision">Vision</option>
                    <option value="architecture">Architecture</option>
                    <option value="runbook">Runbook</option>
                  </Form.Control>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowModal(false); setEditingDoc(null); }}>
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
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"?`}
      />
    </div>
  );
}

export default DocList;
