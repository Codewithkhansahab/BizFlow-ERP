import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useContext } from 'react';
import VerifyOTP from './VerifyOTP';
import ResetPasswordWithOTP from './ResetPasswordWithOTP';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email', 'verify', 'reset'
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(`${backendUrl}/api/users/send-reset-otp`, 
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('OTP sent to your email');
        setStep('verify');
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = (verifiedOtp) => {
    setOtp(verifiedOtp);
    setStep('reset');
  };

  if (step === 'verify') {
    return <VerifyOTP email={email} onSuccess={handleOTPVerified} />;
  }

  if (step === 'reset') {
    return <ResetPasswordWithOTP email={email} otp={otp} />;
  }

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: 'linear-gradient(135deg, #ff6ec4 0%, #7873f5 50%, #4ADEDE 100%)' }}
    >
      <Card
        className="shadow-lg p-4 rounded-4 text-white"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-4">Forgot Password</Card.Title>
          <Form onSubmit={handleSendOTP}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>
            <Button 
              variant="light" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
            <div className="text-center">
              <a href="/login" className="text-decoration-none text-white">
                Back to Login
              </a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
