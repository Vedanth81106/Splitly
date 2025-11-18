import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate(); 

  function logout(){
    localStorage.removeItem('token');
    setToken(null); 
    navigate('/');
  }

  const isAuthenticated = !!token;

  return { isAuthenticated, logout }
}