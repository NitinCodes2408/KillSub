import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginPage from './pages/LoginPage';
import Upload from './pages/Upload';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-dark text-gray-100 selection:bg-neon-blue selection:text-black">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
