import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { backendUrl,userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // track if OTP has been sent

  const sendOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/users/send-verify-otp`, {}, { withCredentials: true });
      if (data.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
  e.preventDefault();
  if (!otp) return toast.error("Please enter OTP");

  try {
    setLoading(true);
    const { data } = await axios.post(`${backendUrl}/api/users/verify-account`, { otp }, { withCredentials: true });

    if (data.success) {
      toast.success(data.message || "Email verified successfully!");
      const role = userData.role;
      switch(role) {
        case 'Admin': navigate('/admin'); break;
        case 'HR': navigate('/hr'); break;
        case 'Employee': navigate('/employee'); break;
        case 'CEO': navigate('/ceo'); break;
        case 'Manager': navigate('/manager'); break;
        default: navigate('/dashboard');
      }
    } else {
      toast.error(data.message || "Verification failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #4ADEDE 0%, #7873f5 50%, #ff6ec4 100%)' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-lg p-4 rounded-4 text-dark" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold">Verify Your Email</h2>
              <p className="text-muted">Click below to receive an OTP and verify your account.</p>
            </div>

            {!otpSent ? (
              <Button variant="primary" className="w-100 py-2" onClick={sendOtp} disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP to Email'}
              </Button>
            ) : (
              <Form onSubmit={handleVerify}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 py-2" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </Form>
            )}

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
