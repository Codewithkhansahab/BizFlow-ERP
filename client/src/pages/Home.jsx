// import React from 'react';
// import Navbar from '../components/Navbar';
// import Header from '../components/Header';

// const Home = () => {
//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         background: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
//         paddingBottom: '40px'
//       }}
//     >
//       <Navbar />
//       <div style={{ paddingTop: '20px' }}>
//         <Header />
//       </div>
//     </div>
//   );
// };

// export default Home;




import React from 'react';
import MyNavbar from '../components/Navbar'; 
import Header from '../components/Header';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { CheckCircle, Users, BarChart3, Layers } from 'lucide-react'; 

const Home = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
      }}
    >
      {/* Navbar */}
      <MyNavbar />

      {/* Header */}
      <div style={{ paddingTop: '30px' }}>
        <Header />
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center fw-bold text-dark mb-5">Why Choose BizFlow ERP?</h2>
        <Row className="g-4">
          <Col md={3}>
            <Card className="p-4 text-center shadow-lg rounded-4 border-0">
              <CheckCircle size={40} className="text-primary mx-auto mb-3" />
              <h5 className="fw-bold">Easy to Use</h5>
              <p className="text-muted">Simple, user-friendly design for all employees.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-4 text-center shadow-lg rounded-4 border-0">
              <Users size={40} className="text-success mx-auto mb-3" />
              <h5 className="fw-bold">Team Collaboration</h5>
              <p className="text-muted">Manage teams, tasks, and communication easily.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-4 text-center shadow-lg rounded-4 border-0">
              <BarChart3 size={40} className="text-danger mx-auto mb-3" />
              <h5 className="fw-bold">Real-time Insights</h5>
              <p className="text-muted">Track reports and progress in real-time.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-4 text-center shadow-lg rounded-4 border-0">
              <Layers size={40} className="text-warning mx-auto mb-3" />
              <h5 className="fw-bold">All-in-One</h5>
              <p className="text-muted">Attendance, payroll, inventory – all in one ERP.</p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Call To Action */}
      <div className="text-center py-5 bg-white shadow-sm">
        <h2 className="fw-bold text-dark mb-3">Start Managing Your Business Smarter</h2>
        <p className="text-muted mb-4">Join BizFlow ERP today and simplify your workflow.</p>
        <Button variant="primary" size="lg" className="px-5 py-2 fw-semibold rounded-pill">
          Get Started
        </Button>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-white mt-4" style={{ background: '#0d6efd' }}>
        <p className="mb-0">&copy; {new Date().getFullYear()} BizFlow ERP. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
