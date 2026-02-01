import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik } from 'formik';

function CrudListModal({
  title,
  show,
  onClose,
  onSubmit,
  initialValues,
  validationSchema,
  renderForm,
  editingItem,
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingItem ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <Modal.Body>
              {renderForm(formikProps)}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default CrudListModal;
