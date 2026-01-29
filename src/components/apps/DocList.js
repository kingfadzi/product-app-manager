import React from 'react';
import { Form, Badge } from 'react-bootstrap';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import CrudList from '../common/CrudList';
import { DOC_TYPE_COLORS } from '../../constants/badges';

const docSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  url: Yup.string().url('Invalid URL').required('URL is required'),
  type: Yup.string().oneOf(['roadmap', 'vision', 'architecture', 'runbook']).required('Type is required'),
});

const initialValues = {
  title: '',
  url: '',
  type: 'architecture',
};

const columns = [
  {
    key: 'title',
    header: 'Title',
    render: (doc) => (
      <a href={doc.url} target="_blank" rel="noopener noreferrer">
        {doc.title}
      </a>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (doc) => <Badge variant={DOC_TYPE_COLORS[doc.type]}>{doc.type}</Badge>,
  },
];

const renderForm = ({ values, errors, touched, handleChange, handleBlur }) => (
  <>
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
  </>
);

function DocList({ appId }) {
  const { getAppDocs, createDoc, updateDoc, deleteDoc, loading } = useApps();

  return (
    <CrudList
      title="Documentation"
      itemLabel="documents"
      loadItems={() => getAppDocs(appId)}
      onAdd={(values) => createDoc(appId, values)}
      onEdit={(id, values) => updateDoc(id, values)}
      onDelete={(id) => deleteDoc(id)}
      columns={columns}
      validationSchema={docSchema}
      initialValues={initialValues}
      renderForm={renderForm}
      getItemName={(doc) => doc.title}
      emptyTitle="No documents"
      emptyDescription="Add documentation links for this app."
      loading={loading}
    />
  );
}

export default DocList;
