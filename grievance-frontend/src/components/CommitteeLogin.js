import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CommitteeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      alert('Login successful');
      navigate('/committee-portal'); // Redirect to CommitteePortal
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Navigate to ForgotPassword page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with logo */}
      <header className="bg-blue-500 text-white p-0 fixed w-full top-0 left-0 h-24 z-10 flex items-center justify-center shadow-lg">
        <img
          id="logo"
          src="Logo.jpg"
          alt="Logo"
          className="absolute w-40 h-24 left-0 top-1/2 transform -translate-y-1/2 border-2 border-white shadow-lg"
        />
        <h1 className="pl-64 text-lg font-bold text-center">
          BIRLA INSTITUTE OF TECHNOLOGY
        </h1>
      </header>

      {/* Centered login form */}
      <div className="flex justify-center items-center min-h-screen pt-28">
        <div className="w-full max-w-sm md:max-w-md p-6 md:p-8 bg-white rounded-lg shadow-2xl transform transition-all">
          <h2 className="text-2xl font-bold mb-4 text-center">Committee Login</h2>
          <hr className="mb-6" />
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="block text-left font-semibold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 transition"
                placeholder="Enter your BIT email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="block text-left font-semibold mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 transition"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
            {/* <button
              type="button"
              onClick={handleForgotPassword} // Handle Forgot Password click
              className="w-full py-3 text-blue-500 underline hover:text-blue-700 transition"
            >
              Forgot Password?
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommitteeLogin;
