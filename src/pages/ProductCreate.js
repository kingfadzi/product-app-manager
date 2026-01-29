import React, { useState } from 'react';
import { Button, Form, Row, Col, Table, Alert, Badge, Breadcrumb } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useProducts from '../hooks/useProducts';
import PageLayout from '../components/layout/PageLayout';
import AddAppModal from '../components/products/AddAppModal';

const productSchema = Yup.object().shape({
  stack: Yup.string().required('Product Stack is required'),
  name: Yup.string().min(2).max(100).required('Name is required'),
  description: Yup.string().max(500),
});

function ProductCreate() {
  const history = useHistory();
  const { createProduct, addAppToProduct } = useProducts();
  const [error, setError] = useState(null);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [addedApps, setAddedApps] = useState([]); // Apps with their metadata

  const handleAddApp = (selectedApps, metadata) => {
    const appWithMetadata = {
      ...selectedApps[0],
      metadata
    };
    setAddedApps([...addedApps, appWithMetadata]);
    setShowAddAppModal(false);
  };

  const handleRemoveApp = (appId) => {
    setAddedApps(addedApps.filter(a => a.id !== appId));
  };

  const handleSubmit = async (values) => {
    try {
      setError(null);
      const product = await createProduct({
        name: values.name,
        stack: values.stack,
        description: values.description,
      });

      // Add apps with their metadata
      for (const app of addedApps) {
        await addAppToProduct(product.id, app.id, app.metadata);
      }

      history.push(`/products/${product.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const existingAppIds = addedApps.map(a => a.id);

  return (
    <PageLayout>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push('/products')}>Products</Breadcrumb.Item>
        <Breadcrumb.Item active>New Product</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mb-4">Create New Product</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Formik
        initialValues={{
          stack: '',
          name: '',
          description: '',
        }}
        validationSchema={productSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Product Stack *</Form.Label>
                  <Form.Control
                    as="select"
                    name="stack"
                    value={values.stack}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.stack && errors.stack}
                  >
                    <option value="">Select a stack...</option>
                    <option value="payments">Payments</option>
                    <option value="customer">Customer</option>
                    <option value="operations">Operations</option>
                    <option value="analytics">Analytics</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="security">Security</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.stack}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && errors.name}
                    placeholder="Enter product name"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                    placeholder="Enter product description"
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    Applications
                    {addedApps.length > 0 && <Badge variant="info" className="ml-2">{addedApps.length}</Badge>}
                  </h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowAddAppModal(true)}
                  >
                    Add Application
                  </Button>
                </div>

                {addedApps.length === 0 ? (
                  <div className="text-center py-4 border rounded bg-light">
                    <p className="text-muted mb-2">No applications added yet</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowAddAppModal(true)}
                    >
                      Add Application
                    </Button>
                  </div>
                ) : (
                  <Table size="sm" bordered>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>CMDB ID</th>
                        <th>Repos</th>
                        <th>Jira</th>
                        <th>Contacts</th>
                        <th>Docs</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedApps.map(app => (
                        <tr key={app.id}>
                          <td>{app.name}</td>
                          <td><code>{app.cmdbId}</code></td>
                          <td><Badge variant="secondary">{app.metadata?.repos?.length || 0}</Badge></td>
                          <td><Badge variant="secondary">{app.metadata?.backlogs?.length || 0}</Badge></td>
                          <td><Badge variant="secondary">{app.metadata?.contacts?.length || 0}</Badge></td>
                          <td><Badge variant="secondary">{app.metadata?.docs?.length || 0}</Badge></td>
                          <td>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-danger"
                              onClick={() => handleRemoveApp(app.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

                <hr className="my-4" />

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => history.push('/products')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={isSubmitting}
                  >
                    Create Product
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>

      <AddAppModal
        show={showAddAppModal}
        onHide={() => setShowAddAppModal(false)}
        onAdd={handleAddApp}
        existingAppIds={existingAppIds}
      />
    </PageLayout>
  );
}

export default ProductCreate;
