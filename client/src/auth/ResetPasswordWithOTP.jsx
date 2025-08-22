import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useContext } from 'react';

const ResetPasswordWithOTP = ({ email, otp }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  // Password validation helpers
  const passwordRules = {
    length: /.{8,}/,
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/,
  };

  const getPasswordValidity = (pw) => ({
    length: passwordRules.length.test(pw),
    upper: passwordRules.upper.test(pw),
    lower: passwordRules.lower.test(pw),
    number: passwordRules.number.test(pw),
    special: passwordRules.special.test(pw),
  });

  const isPasswordValid = (pw) => {
    const v = getPasswordValidity(pw);
    return v.length && v.upper && v.lower && v.number && v.special;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(`${backendUrl}/api/users/reset-password-otp`, {
        email,
        otp,
        newPassword: password
      });

      if (response.data.success) {
        toast.success('Password has been reset successfully');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid
    className="d-flex align-items-center justify-content-center min-vh-100"
    style={{ background: 'linear-gradient(135deg, #ff6ec4 0%, #7873f5 50%, #4ADEDE 100%)' }}>
      <Card className="shadow-lg p-4 rounded-4 text-white"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-4">Reset Your Password</Card.Title>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                placeholder="Enter new password"
                isInvalid={!!password && !isPasswordValid(password)}
              />
              <div className="small mt-2">
                {(() => {
                  const v = getPasswordValidity(password);
                  return (
                    <ul className="mb-0 ps-3">
                      <li className={v.length ? 'text-success' : 'text-danger'}>At least 8 characters</li>
                      <li className={v.upper ? 'text-success' : 'text-danger'}>At least one uppercase letter (A-Z)</li>
                      <li className={v.lower ? 'text-success' : 'text-danger'}>At least one lowercase letter (a-z)</li>
                      <li className={v.number ? 'text-success' : 'text-danger'}>At least one number (0-9)</li>
                      <li className={v.special ? 'text-success' : 'text-danger'}>At least one special character (!@#$…)</li>
                    </ul>
                  );
                })()}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!confirmPassword && password !== confirmPassword}
                placeholder="Confirm new password"
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match
              </Form.Control.Feedback>
            </Form.Group>

            <Button 
              variant="light" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword || !isPasswordValid(password)}
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
              Reset Password
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

export default ResetPasswordWithOTP;
