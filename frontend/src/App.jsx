import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import UploadReceipt from './pages/UploadReceipt';
import DashboardLayout from './components/layout/DashboardLayout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/transactions" element={
        <PrivateRoute>
          <DashboardLayout>
            <Transactions />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/upload" element={
        <PrivateRoute>
          <DashboardLayout>
            <UploadReceipt />
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/reports" element={
        <PrivateRoute>
          <DashboardLayout>
            <div className="text-white text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Reports</h1>
              <p className="text-slate-400">Coming Soon</p>
            </div>
          </DashboardLayout>
        </PrivateRoute>
      } />
      
      <Route path="/settings" element={
        <PrivateRoute>
          <DashboardLayout>
            <div className="text-white text-center py-20">
              <h1 className="text-3xl font-bold mb-4">Settings</h1>
              <p className="text-slate-400">Coming Soon</p>
            </div>
          </DashboardLayout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;