import React  from 'react';
import Modal  from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const MorseModal = ({modalContent, ...props}) => {
  return (
    <>
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Morse Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img src="International_Morse_Code-fr.png" alt="morse code table"/>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-danger"
          size="lg"
          onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default MorseModal;
