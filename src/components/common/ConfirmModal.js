import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
