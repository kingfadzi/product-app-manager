import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';

const repoSchema = Yup.object().shape({
  repoPath: Yup.string().required('Repository path is required'),
  repoName: Yup.string().required('Repository name is required'),
  role: Yup.string().oneOf(['backend', 'frontend', 'infra', 'docs']).required('Role is required'),
  isPrimary: Yup.boolean(),
});

function RepoList({ appId }) {
  const { getAppRepos, createRepo, updateRepo, deleteRepo, loading } = useApps();
  const [repos, setRepos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRepo, setEditingRepo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadRepos();
  }, [appId]);

  const loadRepos = async () => {
    const data = await getAppRepos(appId);
    setRepos(data);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (editingRepo) {
      await updateRepo(editingRepo.id, values);
    } else {
      await createRepo(appId, values);
    }
    await loadRepos();
    setShowModal(false);
    setEditingRepo(null);
    resetForm();
  };

  const handleEdit = (repo) => {
    setEditingRepo(repo);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteRepo(deleteConfirm.id);
      await loadRepos();
      setDeleteConfirm(null);
    }
  };

  const roleColors = {
    backend: 'primary',
    frontend: 'success',
    infra: 'warning',
    docs: 'info',
  };

  if (loading && repos.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Repositories</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Add Repository
        </Button>
      </div>

      {repos.length === 0 ? (
        <EmptyState
          title="No repositories"
          description="Add repositories linked to this app."
          actionLabel="Add Repository"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Role</th>
              <th>Primary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {repos.map(repo => (
              <tr key={repo.id}>
                <td>
                  <div>{repo.repoName}</div>
                  <small className="text-muted">{repo.repoPath}</small>
                </td>
                <td>
                  <Badge variant={roleColors[repo.role]}>{repo.role}</Badge>
                </td>
                <td>{repo.isPrimary ? 'Yes' : 'No'}</td>
                <td>
                  <Button variant="link" size="sm" onClick={() => handleEdit(repo)}>
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger"
                    onClick={() => setDeleteConfirm(repo)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingRepo(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRepo ? 'Edit Repository' : 'Add Repository'}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            repoPath: editingRepo?.repoPath || '',
            repoName: editingRepo?.repoName || '',
            role: editingRepo?.role || 'backend',
            isPrimary: editingRepo?.isPrimary || false,
          }}
          validationSchema={repoSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Repository Path</Form.Label>
                  <Form.Control
                    name="repoPath"
                    value={values.repoPath}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.repoPath && errors.repoPath}
                    placeholder="org/repo-name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.repoPath}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Repository Name</Form.Label>
                  <Form.Control
                    name="repoName"
                    value={values.repoName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.repoName && errors.repoName}
                    placeholder="repo-name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.repoName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="backend">Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="infra">Infrastructure</option>
                    <option value="docs">Documentation</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isPrimary"
                    label="Primary Repository"
                    checked={values.isPrimary}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowModal(false); setEditingRepo(null); }}>
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
        title="Delete Repository"
        message={`Are you sure you want to delete "${deleteConfirm?.repoName}"?`}
      />
    </div>
  );
}

export default RepoList;
