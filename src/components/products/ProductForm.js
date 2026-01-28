import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
});

function ProductForm({ initialValues, onSubmit, submitLabel = 'Save' }) {
  const defaultValues = {
    name: '',
    description: '',
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.name && errors.name}
              placeholder="Enter product name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
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
              placeholder="Enter product description"
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default ProductForm;
