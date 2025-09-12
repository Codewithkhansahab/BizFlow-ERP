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
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { CheckCircle, Users, BarChart3, Layers, Shield, Zap, Clock, Award, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle size={50} />,
      title: "Easy to Use",
      description: "Intuitive interface designed for all skill levels",
      color: "text-primary",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: <Users size={50} />,
      title: "Team Collaboration", 
      description: "Seamless team management and communication",
      color: "text-success",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: <BarChart3 size={50} />,
      title: "Real-time Analytics",
      description: "Live insights and comprehensive reporting",
      color: "text-danger", 
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      icon: <Layers size={50} />,
      title: "All-in-One Platform",
      description: "Complete ERP solution for modern businesses",
      color: "text-warning",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Clients", icon: <Users size={24} /> },
    { number: "99.9%", label: "Uptime", icon: <Shield size={24} /> },
    { number: "24/7", label: "Support", icon: <Clock size={24} /> },
    { number: "5★", label: "Rating", icon: <Star size={24} /> }
  ];

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Navbar */}
      <MyNavbar />

      {/* Hero Section */}
      <div style={{ paddingTop: '30px' }}>
        <Header />
      </div>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-5"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }} />
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className="text-center text-white">
            {stats.map((stat, index) => (
              <Col md={3} key={index} className="mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-2">{stat.icon}</div>
                  <h2 className="fw-bold mb-1">{stat.number}</h2>
                  <p className="mb-0 opacity-75">{stat.label}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </motion.section>

      {/* Features Section */}
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-5"
        >
          <Badge bg="primary" className="px-3 py-2 rounded-pill mb-3">
            <Zap size={16} className="me-2" />
            Features
          </Badge>
          <h2 className="display-5 fw-bold text-dark mb-3">Why Choose BizFlow ERP?</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Discover the powerful features that make BizFlow the perfect choice for your business
          </p>
        </motion.div>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={6} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card 
                  className="h-100 border-0 shadow-lg rounded-4 overflow-hidden"
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="p-2"
                    style={{ background: feature.gradient }}
                  />
                  <Card.Body className="p-4 text-center">
                    <div className={`${feature.color} mb-3`}>
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Benefits Section */}
      <section 
        className="py-5"
        style={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'relative'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge bg="success" className="px-3 py-2 rounded-pill mb-3">
                  <Award size={16} className="me-2" />
                  Benefits
                </Badge>
                <h2 className="display-6 fw-bold text-dark mb-4">
                  Transform Your Business Operations
                </h2>
                <div className="mb-4">
                  {[
                    "Reduce administrative overhead by 60%",
                    "Improve team productivity and collaboration", 
                    "Real-time insights for better decision making",
                    "Streamlined workflows and automation"
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="d-flex align-items-center mb-3"
                    >
                      <CheckCircle size={20} className="text-success me-3" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="px-4 py-3 fw-semibold rounded-pill border-0 shadow-lg"
                  style={{
                    background: 'linear-gradient(90deg, #ff6a00, #ee0979)',
                    color: '#fff'
                  }}
                  onClick={() => navigate('/login')}
                >
                  Start Free Trial <ArrowRight size={20} className="ms-2" />
                </Button>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <img
                  src="/generated-image (4).png"
                  alt="Dashboard Preview"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call To Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)'
        }} />
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <div className="text-center text-white">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead mb-4 opacity-75">
                Join thousands of businesses already using BizFlow ERP
              </p>
              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <Button
                  size="lg"
                  variant="light"
                  className="px-5 py-3 fw-semibold rounded-pill shadow-lg"
                  onClick={() => navigate('/login')}
                >
                  Get Started Free <ArrowRight size={20} className="ms-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline-light"
                  className="px-5 py-3 fw-semibold rounded-pill"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </motion.section>

      {/* Footer */}
      <footer 
        className="py-5 text-white"
        style={{ 
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
        }}
      >
        <Container>
          <Row>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <img
                  src="/generated-image (3).png"
                  alt="logo"
                  width="40"
                  height="40"
                  className="me-2 rounded-circle"
                />
                <span className="fw-bold fs-4">BizFlow ERP</span>
              </div>
              <p className="text-light opacity-75 mb-0">
                Empowering businesses with smart, scalable ERP solutions.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-2">
                <strong>Contact:</strong> support@bizflow.com
              </p>
              <p className="mb-0 opacity-75">
                &copy; {new Date().getFullYear()} BizFlow ERP. All Rights Reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
