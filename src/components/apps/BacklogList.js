import React from 'react';
import { Form, Badge } from 'react-bootstrap';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import CrudList from '../common/CrudList';
import { BACKLOG_PURPOSE_COLORS } from '../../constants/badges';

const backlogSchema = Yup.object().shape({
  projectKey: Yup.string().required('Project key is required'),
  projectName: Yup.string().required('Project name is required'),
  purpose: Yup.string().oneOf(['product', 'ops', 'security']).required('Purpose is required'),
  isPrimary: Yup.boolean(),
});

const initialValues = {
  projectKey: '',
  projectName: '',
  purpose: 'product',
  isPrimary: false,
};

const columns = [
  {
    key: 'projectKey',
    header: 'Project',
    render: (backlog) => (
      <>
        <div><strong>{backlog.projectKey}</strong></div>
        <small className="text-muted">{backlog.projectName}</small>
      </>
    ),
  },
  {
    key: 'purpose',
    header: 'Purpose',
    render: (backlog) => <Badge variant={BACKLOG_PURPOSE_COLORS[backlog.purpose]}>{backlog.purpose}</Badge>,
  },
  {
    key: 'isPrimary',
    header: 'Primary',
    render: (backlog) => (backlog.isPrimary ? 'Yes' : 'No'),
  },
];

const renderForm = ({ values, errors, touched, handleChange, handleBlur }) => (
  <>
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
  </>
);

function BacklogList({ appId }) {
  const { getAppBacklogs, createBacklog, updateBacklog, deleteBacklog, loading } = useApps();

  return (
    <CrudList
      title="Backlogs"
      itemLabel="backlogs"
      loadItems={() => getAppBacklogs(appId)}
      onAdd={(values) => createBacklog(appId, values)}
      onEdit={(id, values) => updateBacklog(id, values)}
      onDelete={(id) => deleteBacklog(id)}
      columns={columns}
      validationSchema={backlogSchema}
      initialValues={initialValues}
      renderForm={renderForm}
      getItemName={(backlog) => backlog.projectKey}
      emptyTitle="No backlogs"
      emptyDescription="Add project backlogs linked to this app."
      loading={loading}
    />
  );
}

export default BacklogList;
