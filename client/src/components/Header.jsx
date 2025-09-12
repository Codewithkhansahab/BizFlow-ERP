import React from "react";
import { Button, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  // Floating animation for background elements
  const floatingAnimation = {
    y: [-20, 20, -20],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center text-center position-relative"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "100px",
        overflow: "hidden"
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={floatingAnimation}
        className="position-absolute"
        style={{
          top: "20%",
          left: "10%",
          width: "100px",
          height: "100px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          backdropFilter: "blur(10px)"
        }}
      />
      <motion.div
        animate={{
          y: [20, -20, 20],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="position-absolute"
        style={{
          top: "60%",
          right: "15%",
          width: "150px",
          height: "150px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "30%",
          backdropFilter: "blur(5px)"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="container position-relative"
        style={{ zIndex: 2 }}
      >
        {/* New Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <Badge 
            className="px-4 py-2 rounded-pill border-0 shadow-lg"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontSize: "0.9rem"
            }}
          >
            <Sparkles size={16} className="me-2" />
            New: Advanced Analytics Dashboard
          </Badge>
        </motion.div>

        {/* Hero Image with enhanced animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.3,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.3 }
          }}
          className="mb-4"
        >
          <div
            className="position-relative mx-auto"
            style={{ width: "200px", height: "200px" }}
          >
            {/* Glowing ring effect */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
              style={{
                background: "linear-gradient(45deg, #ff6a00, #ee0979, #667eea)",
                padding: "4px",
                animation: "spin 10s linear infinite"
              }}
            >
              <img
                src="/generated-image (3).png"
                alt="BizFlow ERP"
                className="w-100 h-100 rounded-circle shadow-lg"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Headings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="display-2 fw-bold text-white mb-3">
            Empower Your Business with{" "}
            <motion.span 
              className="text-warning"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255,193,7,0.5)",
                  "0 0 40px rgba(255,193,7,0.8)",
                  "0 0 20px rgba(255,193,7,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              BizFlow ERP
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h4 className="text-light mb-4 fw-light">
            Smart. Simple. Scalable. Secure.
          </h4>
        </motion.div>

        {/* Enhanced Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p className="lead text-white-50 mx-auto mb-5" style={{ maxWidth: "720px" }}>
            Transform your business operations with our comprehensive ERP solution. 
            Manage attendance, payroll, tasks, and inventory with powerful analytics 
            and real-time insights.
          </p>
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="d-flex flex-column flex-md-row gap-3 justify-content-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="px-5 py-3 fw-semibold rounded-pill border-0 shadow-lg"
              style={{
                background: "linear-gradient(90deg, #ff6a00, #ee0979)",
                color: "#fff",
                fontSize: "1.1rem",
              }}
              onClick={() => navigate("/login")}
            >
              🚀 Get Started Free
              <ArrowRight size={20} className="ms-2" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline-light"
              className="px-5 py-3 fw-semibold rounded-pill"
              style={{ fontSize: "1.1rem" }}
            >
              <Play size={18} className="me-2" />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-5 pt-4"
        >
          <p className="text-white-50 small mb-3">Trusted by 500+ businesses worldwide</p>
          <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 rounded px-3 py-2 backdrop-blur"
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white-50 small">Company {i}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* CSS for spinning animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Header;
