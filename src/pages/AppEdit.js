import React, { useContext, useState } from 'react';
import { Card, Alert, Breadcrumb } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import useApps from '../hooks/useApps';
import PageLayout from '../components/layout/PageLayout';
import AppForm from '../components/apps/AppForm';

function AppEdit() {
  const { id } = useParams();
  const history = useHistory();
  const { apps } = useContext(AppContext);
  const { updateApp, error } = useApps();
  const [success, setSuccess] = useState(false);

  const app = apps.find(a => a.id === id);

  if (!app) {
    return (
      <PageLayout>
        <Alert variant="warning">App not found.</Alert>
      </PageLayout>
    );
  }

  const handleSubmit = async (values) => {
    await updateApp(id, values);
    setSuccess(true);
    setTimeout(() => {
      history.push(`/apps/${id}`);
    }, 1000);
  };

  return (
    <PageLayout>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/apps')}>Applications</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push(`/apps/${id}`)}>{app.name}</Breadcrumb.Item>
        <Breadcrumb.Item active>Edit</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">Edit App: {app.name}</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">App updated successfully!</Alert>}

      <Card>
        <Card.Body>
          <AppForm
            initialValues={app}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            onCancel={() => history.push(`/apps/${id}`)}
          />
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default AppEdit;
