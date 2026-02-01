import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ProductAppsSection from './ProductAppsSection';

const productSchema = Yup.object().shape({
  stack: Yup.string().required('Product Stack is required'),
  name: Yup.string().min(2).max(100).required('Name is required'),
  description: Yup.string().max(500),
});

function ProductCreateForm({
  onSubmit,
  onCancel,
  onOpenModal,
  onRemoveApp,
  addedApps,
}) {
  return (
    <Formik
      initialValues={{
        stack: '',
        name: '',
        description: '',
      }}
      validationSchema={productSchema}
      onSubmit={onSubmit}
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

              <ProductAppsSection
                addedApps={addedApps}
                onOpenModal={onOpenModal}
                onRemoveApp={onRemoveApp}
              />

              <hr className="my-4" />

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="mr-2" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="success" disabled={isSubmitting}>
                  Create Product
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

export default ProductCreateForm;
