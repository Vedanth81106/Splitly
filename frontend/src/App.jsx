import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return ( 
    <>
      <Navbar /> 
      <Routes>
        {/* Public routes */}
        <Route path="/" element={ <HomePage /> } />
        <Route path="/login" element={ <AuthPage /> } /> 

        {/* Private routes */}
        <Route 
          path = "/dashboard"
          element = {
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;