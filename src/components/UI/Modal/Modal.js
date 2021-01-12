import React from 'react';
import Modal from 'react-bootstrap/Modal';

const modal = (props) => {
    
    return (
            <Modal show={props.show} onHide={props.handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {props.children}
                </Modal.Body>
            
        </Modal>

    )};

export default modal;