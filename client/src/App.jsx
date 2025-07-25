import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AddDataForm from './components/AddDataForm';
import ClientTable from './components/ClientTable';
import Login from './components/Login';
import Register from './components/Register';
import ChannelSummary from './components/ChannelSummary';
import { useUserContext } from './context/UserContext';
import PaymentHistory from './components/PaymentHistory';
import { attachInterceptors } from './utils/axiosInstance';

export default function App() {
  const { token, setToken } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Attach interceptors
  useEffect(() => {
    attachInterceptors(logout, () => token);
  }, [token, setToken]);

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [token, location.pathname, navigate]);

  // While logged out
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // If logged in
  return (
    <div className="flex w-full max-h-screen bg-gray-100 overflow-y-hidden ">
      <Sidebar />
      <div className="flex-1  overflow-y-auto p-0">
        <Routes>
          <Route path="/" element={<Navigate to="/client" />} />
          <Route path="/add" element={<AddDataForm token={token} />} />
          <Route path="/client" element={<ClientTable token={token} />} />
          <Route path="/channel-summary" element={<ChannelSummary token={token} />} />
          <Route path="/payment-history" element={<PaymentHistory token={token} />} />

        </Routes>
      </div>
    </div>
  );
}
