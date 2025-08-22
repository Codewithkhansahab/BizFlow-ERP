// // import React from "react";
// import { Navbar, Container, Button, Nav } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const MyNavbar = () => {
//   const navigate = useNavigate();

//   return (
//     <Navbar expand="lg" className="py-3 fixed-top" style={{ background: "rgba(255,255,255,0.9)" }}>
//       <Container>
//         {/* Brand / Logo */}
//         <Navbar.Brand
//           onClick={() => navigate("/")}
//           style={{ cursor: "pointer" }}
//           className="d-flex align-items-center"
//         >
//           <img
//             src="/generated-image (3).png"
//             alt="logo"
//             width="45"
//             height="45"
//             className="me-2 rounded-circle border border-2 border-primary"
//           />
//           <span className="fw-bold fs-4 text-primary">BizFlow</span>
//         </Navbar.Brand>

//         {/* Right Side */}
//         <Nav>
//           <Button
//             onClick={() => navigate("/login")}
//             className="px-4 fw-semibold rounded-pill shadow-sm border-0"
//             style={{
//               background: "linear-gradient(45deg, #66a6ff, #89f7fe)",
//               color: "#fff"
//             }}
//           >
//             Login
//           </Button>
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// };

// export default MyNavbar;
import React from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyNavbar = () => {
  const navigate = useNavigate();

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="py-3 shadow-sm"
      style={{
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0.7)",
      }}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img
            src="/generated-image (3).png"
            alt="logo"
            width="50"
            height="50"
            className="me-2 rounded-circle border border-2 border-primary shadow-sm"
          />
          <span className="fw-bold fs-3 text-primary">BizFlow</span>
        </Navbar.Brand>

        {/* Right Side */}
        <Nav>
          <Button
            onClick={() => navigate("/login")}
            className="px-4 fw-semibold rounded-pill border-0 shadow-sm"
            style={{
              background: "linear-gradient(90deg, #ff6a00, #ee0979)",
              color: "#fff",
              transition: "0.3s",
            }}
          >
            Login
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
