import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().oneOf(['product_owner', 'tech_lead', 'business_owner', 'sme']).required('Role is required'),
});

function ContactList({ appId }) {
  const { getAppContacts, createContact, updateContact, deleteContact, loading } = useApps();
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadContacts();
  }, [appId]);

  const loadContacts = async () => {
    const data = await getAppContacts(appId);
    setContacts(data);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (editingContact) {
      await updateContact(editingContact.id, values);
    } else {
      await createContact(appId, values);
    }
    await loadContacts();
    setShowModal(false);
    setEditingContact(null);
    resetForm();
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteContact(deleteConfirm.id);
      await loadContacts();
      setDeleteConfirm(null);
    }
  };

  const roleLabels = {
    product_owner: 'Product Owner',
    tech_lead: 'Tech Lead',
    business_owner: 'Business Owner',
    sme: 'SME',
  };

  const roleColors = {
    product_owner: 'primary',
    tech_lead: 'success',
    business_owner: 'warning',
    sme: 'info',
  };

  if (loading && contacts.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Contacts</h5>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <EmptyState
          title="No contacts"
          description="Add key contacts for this app."
          actionLabel="Add Contact"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </td>
                <td>
                  <Badge variant={roleColors[contact.role]}>{roleLabels[contact.role]}</Badge>
                </td>
                <td>
                  <Button variant="link" size="sm" onClick={() => handleEdit(contact)}>
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger"
                    onClick={() => setDeleteConfirm(contact)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingContact(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingContact ? 'Edit Contact' : 'Add Contact'}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: editingContact?.name || '',
            email: editingContact?.email || '',
            role: editingContact?.role || 'tech_lead',
          }}
          validationSchema={contactSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && errors.name}
                    placeholder="John Smith"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                    placeholder="john@example.com"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
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
                    <option value="product_owner">Product Owner</option>
                    <option value="tech_lead">Tech Lead</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="sme">SME</option>
                  </Form.Control>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowModal(false); setEditingContact(null); }}>
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
        title="Delete Contact"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"?`}
      />
    </div>
  );
}

export default ContactList;
