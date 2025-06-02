import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

import AdminDashboard from '../pages/admin/AdminDashboard';
import SlideshowManager from '../pages/admin/SlideshowManager';
import Login from '../pages/admin/Login';

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path=""
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="slideshow-manager"
          element={
            <ProtectedRoute>
              <SlideshowManager />
            </ProtectedRoute>
          }
        />
        {/* ...other admin routes */}
      </Routes>
    </AdminLayout>
  );
}