import React, { useState } from 'react';
import { register, login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {

  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async(event) =>{
    event.preventDefault();

    try{
      let response;

      if(isLoginView){
        response = await login({username, password});
      }else{
        response = await register({firstName, lastName, email, username, password});
      }

      console.log('Success!', response.data);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    }

    catch(error){
      console.error('Authentication failed: ', error.response?.data);
    }
  }

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="p-8 rounded-lg shadow-xl bg-white w-full max-w-md border-2 border-secondary">

        <h2 className="text-3xl font-bold text-center text-text-primary mb-8">
          {isLoginView ? 'Login' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>

          {!isLoginView && (
            <>
              <div className="mb-4">
                <label className="block text-text-primary mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-text-primary mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-text-primary mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* These fields show for BOTH login and register */}
          <div className="mb-4">
            <label className="block text-text-primary mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-text-primary mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* The submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-accent text-text-primary font-bold hover:opacity-90"
          >
            {isLoginView ? 'Login' : 'Sign Up'}
          </button>
        </form>
      

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setIsLoginView(!isLoginView)} 
            className="text-primary hover:underline"
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;