import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Payments from './pages/Payments';
import Claims from './pages/Claims';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (adminOnly && user?.role !== 'ADMIN') {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Layout>
                  <Payments />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/claims" element={
              <ProtectedRoute>
                <Layout>
                  <Claims />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;