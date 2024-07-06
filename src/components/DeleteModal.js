import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ show, handleClose, handleDelete, itemType }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this {itemType}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
