import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import FloatingActions from './components/layout/FloatingActions';

import LandingPage from './pages/LandingPage';
import InstitutionSelectPage from './pages/InstitutionSelectPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AcademicsPage from './pages/AcademicsPage';
import SocietiesEventsPage from './pages/SocietiesEventsPage';
import AdminPage from './pages/AdminPage';

// Simple wrapper to protect routes that require auth
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Or a full-page loader
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-institution" element={<InstitutionSelectPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/academics" element={
          <ProtectedRoute><AcademicsPage /></ProtectedRoute>
        } />
        <Route path="/societies-events" element={
          <ProtectedRoute><SocietiesEventsPage /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminPage /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global FABs - Only show when authenticated */}
      {isAuthenticated && <FloatingActions />}
    </BrowserRouter>
  );
}
