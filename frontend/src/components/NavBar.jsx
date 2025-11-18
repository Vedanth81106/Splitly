import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth'; 

const Navbar = () => {
  const location = useLocation(); 
  const { isAuthenticated, logout } = useAuth(); 

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      
      <div className="logo">
        <Link to="/" className="text-3xl font-bold text-primary">
          Splitly
        </Link>
      </div>
  
      <div className="auth-buttons">
        {isAuthenticated ? (
          <button 
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
            onClick={logout} 
          >
            Logout
          </button>
        ) : (
          location.pathname !== '/login' && (
            <Link 
              to="/login"
              className="px-4 py-2 rounded bg-accent text-text-primary font-bold hover:opacity-90"
            >
              Login / Sign Up
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;