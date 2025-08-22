import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useContext } from 'react';

const VerifyOTP = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      
      // Verify OTP with the server
      const response = await axios.post(`${backendUrl}/api/users/verify-otp`, {
        email,
        otp
      });

      if (response.data.success) {
        onSuccess(otp);
      } else {
        toast.error(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/users/send-reset-otp`, { email });
      if (response.data.success) {
        toast.success('New OTP sent to your email');
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: 'linear-gradient(135deg, #ff6ec4 0%, #7873f5 50%, #4ADEDE 100%)' }}
    >
      <Card
        className="shadow-lg p-4 rounded-4 text-white"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-4">Verify OTP</Card.Title>
          <Card.Text className="text-center mb-4">
            We've sent a 6-digit OTP to {email}
          </Card.Text>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter 6-digit OTP</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                required
              />
            </Form.Group>

            <Button 
              variant="light" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
              ) : null}
              Verify OTP
            </Button>

            <div className="text-center">
              <Button 
                variant="link" 
                className="text-white"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerifyOTP;
