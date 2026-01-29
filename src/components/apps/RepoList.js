import React from 'react';
import { Form, Badge } from 'react-bootstrap';
import * as Yup from 'yup';
import useApps from '../../hooks/useApps';
import CrudList from '../common/CrudList';
import { REPO_ROLE_COLORS } from '../../constants/badges';

const repoSchema = Yup.object().shape({
  repoPath: Yup.string().required('Repository path is required'),
  repoName: Yup.string().required('Repository name is required'),
  role: Yup.string().oneOf(['backend', 'frontend', 'infra', 'docs']).required('Role is required'),
  isPrimary: Yup.boolean(),
});

const initialValues = {
  repoPath: '',
  repoName: '',
  role: 'backend',
  isPrimary: false,
};

const columns = [
  {
    key: 'repoName',
    header: 'Repository',
    render: (repo) => (
      <>
        <div>{repo.repoName}</div>
        <small className="text-muted">{repo.repoPath}</small>
      </>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (repo) => <Badge variant={REPO_ROLE_COLORS[repo.role]}>{repo.role}</Badge>,
  },
  {
    key: 'isPrimary',
    header: 'Primary',
    render: (repo) => (repo.isPrimary ? 'Yes' : 'No'),
  },
];

const renderForm = ({ values, errors, touched, handleChange, handleBlur }) => (
  <>
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
  </>
);

function RepoList({ appId }) {
  const { getAppRepos, createRepo, updateRepo, deleteRepo, loading } = useApps();

  return (
    <CrudList
      title="Repositories"
      itemLabel="repos"
      loadItems={() => getAppRepos(appId)}
      onAdd={(values) => createRepo(appId, values)}
      onEdit={(id, values) => updateRepo(id, values)}
      onDelete={(id) => deleteRepo(id)}
      columns={columns}
      validationSchema={repoSchema}
      initialValues={initialValues}
      renderForm={renderForm}
      getItemName={(repo) => repo.repoName}
      emptyTitle="No repositories"
      emptyDescription="Add repositories linked to this app."
      loading={loading}
    />
  );
}

export default RepoList;
