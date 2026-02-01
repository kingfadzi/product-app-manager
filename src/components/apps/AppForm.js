import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  cmdbId: Yup.string()
    .required('CMDB ID is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  tier: Yup.string()
    .oneOf(['gold', 'silver', 'bronze'], 'Invalid tier')
    .required('Tier is required'),
  status: Yup.string()
    .oneOf(['active', 'maintenance', 'deprecated'], 'Invalid status')
    .required('Status is required'),
});

function AppForm({ initialValues, onSubmit, submitLabel = 'Save', onCancel }) {
  const defaultValues = {
    name: '',
    cmdbId: '',
    description: '',
    tier: 'bronze',
    status: 'active',
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>App Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.name && errors.name}
              placeholder="Enter app name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>CMDB ID</Form.Label>
            <Form.Control
              type="text"
              name="cmdbId"
              value={values.cmdbId}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.cmdbId && errors.cmdbId}
              placeholder="APP-XXXX"
            />
            <Form.Control.Feedback type="invalid">
              {errors.cmdbId}
            </Form.Control.Feedback>
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
              placeholder="Enter app description"
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tier</Form.Label>
            <Form.Control
              as="select"
              name="tier"
              value={values.tier}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.tier && errors.tier}
            >
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.tier}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.status && errors.status}
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="deprecated">Deprecated</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.status}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="mt-4">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} className="mr-2">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AppForm;
