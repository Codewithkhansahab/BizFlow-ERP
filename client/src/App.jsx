import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './auth/ForgotPassword';
import ResetPasswordWithOTP from './auth/ResetPasswordWithOTP';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './Admin/AdminDashboard';
import HRDashboard from './HR/HRDashboard';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import ManagerDashboard from './Manager/ManagerDashboard';
import CEODashboard from './CEO/CEODashboard';
import CompleteProfile from './Employee/CompleteProfile';
import SalaryManagement from './HR/SalaryManagement';
import MySalaries from './Employee/MySalaries';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-center"/>
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
          path="/hr/salaries"
          element={
            <RoleRoute roles={["HR"]}>
              <SalaryManagement />
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
          path="/employee/salaries"
          element={
            <RoleRoute roles={["Employee"]}>
              <MySalaries />
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
          path="/manager"
          element={
            <RoleRoute roles={["Manager"]}>
              <ManagerDashboard />
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
        
        {/* Common Dashboard Routes */}
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/:tab" element={<Settings />} /> */}
      </Routes>
    </AuthProvider>
  )
}

export default App;

