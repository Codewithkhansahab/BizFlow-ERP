import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './auth/ForgotPassword';
import ResetPasswordWithOTP from './auth/ResetPasswordWithOTP';

// Dashboard Components
import AdminDashboard from './Admin/AdminDashboard';
import HRDashboard from './HR/HRDashboard';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import ManagerDashboard from './Manager/ManagerDashboard';
import CEODashboard from './CEO/CEODashboard';
import CompleteProfile from './Employee/CompleteProfile';
import SalaryManagement from './HR/SalaryManagement';
import MySalaries from './Employee/MySalaries';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-otp" element={<ResetPasswordWithOTP />} />
        <Route path="/email-verify" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["Admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <RoleRoute roles={["HR"]}>
              <HRDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <RoleRoute roles={["Employee"]}>
              <EmployeeDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <RoleRoute roles={["Manager"]}>
              <ManagerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/ceo"
          element={
            <RoleRoute roles={["CEO"]}>
              <CEODashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salaries"
          element={
            <ProtectedRoute>
              <SalaryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-salaries"
          element={
            <ProtectedRoute>
              <MySalaries />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;