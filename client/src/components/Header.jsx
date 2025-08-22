// import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
  return (
    <div
      className="d-flex align-items-center justify-content-center text-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
        paddingTop: "100px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="container"
      >
        {/* Hero Image */}
        <motion.img
          src="/generated-image (3).png"
          alt="hero"
          className="mb-4 rounded-circle shadow-lg border border-4 border-white"
          style={{ width: "180px", height: "180px", objectFit: "cover" }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Headings */}
        <h1 className="display-2 fw-bold text-white mb-3">
          Empower Your Business with <span className="text-dark">BizFlow ERP</span>
        </h1>
        <h4 className="text-light mb-4">
          Smart. Simple. Scalable.
        </h4>

        {/* Description */}
        <p className="lead text-white-50 mx-auto" style={{ maxWidth: "720px" }}>
          Manage attendance, payroll, tasks, and inventory – all in one powerful ERP
          designed for modern businesses.
        </p>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            size="lg"
            className="mt-4 px-5 py-3 fw-semibold rounded-pill border-0 shadow-lg"
            style={{
              background: "linear-gradient(90deg, #ff6a00, #ee0979)",
              color: "#fff",
              fontSize: "1.2rem",
            }}
            onClick={()=>navigate("/login")}
          >
            🚀 Get Started
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Header;
