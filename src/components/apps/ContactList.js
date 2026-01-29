import React from 'react';
import { Form, Badge } from 'react-bootstrap';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import CrudList from '../common/CrudList';
import { CONTACT_ROLE_COLORS, CONTACT_ROLE_LABELS } from '../../constants/badges';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().oneOf(['product_owner', 'tech_lead', 'business_owner', 'sme']).required('Role is required'),
});

const initialValues = {
  name: '',
  email: '',
  role: 'tech_lead',
};

const columns = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'email',
    header: 'Email',
    render: (contact) => <a href={`mailto:${contact.email}`}>{contact.email}</a>,
  },
  {
    key: 'role',
    header: 'Role',
    render: (contact) => (
      <Badge variant={CONTACT_ROLE_COLORS[contact.role]}>
        {CONTACT_ROLE_LABELS[contact.role]}
      </Badge>
    ),
  },
];

const renderForm = ({ values, errors, touched, handleChange, handleBlur }) => (
  <>
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
  </>
);

function ContactList({ appId }) {
  const { getAppContacts, createContact, updateContact, deleteContact, loading } = useApps();

  return (
    <CrudList
      title="Contacts"
      itemLabel="contacts"
      loadItems={() => getAppContacts(appId)}
      onAdd={(values) => createContact(appId, values)}
      onEdit={(id, values) => updateContact(id, values)}
      onDelete={(id) => deleteContact(id)}
      columns={columns}
      validationSchema={contactSchema}
      initialValues={initialValues}
      renderForm={renderForm}
      getItemName={(contact) => contact.name}
      emptyTitle="No contacts"
      emptyDescription="Add key contacts for this app."
      loading={loading}
    />
  );
}

export default ContactList;
