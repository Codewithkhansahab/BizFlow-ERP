import React from 'react';
import { toast, showConfirmation } from '../utils/sweetAlert';
import { Button, Container, Row, Col } from 'react-bootstrap';

const TestSweetAlert = () => {
  const handleSuccess = () => {
    toast.success('This is a success message!');
  };

  const handleError = () => {
    toast.error('This is an error message!');
  };

  const handleWarning = () => {
    toast.warning('This is a warning message!');
  };

  const handleInfo = () => {
    toast.info('This is an info message!');
  };

  const handleConfirmation = async () => {
    const result = await showConfirmation('Do you want to proceed?', 'Confirmation');
    if (result.isConfirmed) {
      toast.success('You confirmed!');
    } else {
      toast.info('You cancelled!');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h3>SweetAlert2 Test</h3>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="success" onClick={handleSuccess}>
              Test Success
            </Button>
            <Button variant="danger" onClick={handleError}>
              Test Error
            </Button>
            <Button variant="warning" onClick={handleWarning}>
              Test Warning
            </Button>
            <Button variant="info" onClick={handleInfo}>
              Test Info
            </Button>
            <Button variant="secondary" onClick={handleConfirmation}>
              Test Confirmation
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TestSweetAlert;