import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdSpacesPage from './pages/AdSpacesPage';
import AdSpaceDetailPage from './pages/AdSpaceDetailPage';
import CreateAdSpacePage from './pages/CreateAdSpacePage';
import BookingsPage from './pages/BookingsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - all authenticated users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adspaces"
          element={
            <ProtectedRoute>
              <AdSpacesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adspaces/:id"
          element={
            <ProtectedRoute>
              <AdSpaceDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Provider/Admin only */}
        <Route
          path="/adspaces/create"
          element={
            <ProtectedRoute requiredRoles={['PROVIDER', 'ADMIN']}>
              <CreateAdSpacePage />
            </ProtectedRoute>
          }
        />

        {/* Advertiser/Admin only */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute requiredRoles={['ADVERTISER', 'ADMIN']}>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
