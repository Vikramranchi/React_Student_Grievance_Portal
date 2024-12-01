
// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState(false); // Track email validity
  const navigate = useNavigate();

  // Regular expression to match the pattern for the email
  const emailPattern = /^[a-zA-Z]{1,5}\d{1,5}\.\d{2}@bitmesra\.ac\.in$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Check if the email matches the pattern
    if (emailPattern.test(value)) {
      setEmailValid(true); // Email is valid
      setError(''); // Clear error if valid
    } else {
      setEmailValid(false); // Email is not valid
      setError('Email format should be like mca10057.23@bitmesra.ac.in');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Only proceed if the email is valid
    if (!emailValid) {
      setError('Please enter a valid email format.');
      return;
    }

    try {
      const response = await fetch('https://react-student-grievance-portal-8.onrender.com/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the JWT in localStorage
        localStorage.setItem('jwtToken', data.token);

        // Navigate to First.js after successful login
        navigate('/first');
      } else {
        setError(data.message); // Display the error message from the server
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Header with 8px bottom margin */}
      <Header className="fixed top-1 left-0 w-full z-10 mb-2" /> 
      
      {/* Add margin to maintain 8px distance from header */}
      <div className="flex flex-grow justify-center items-start mt-2"> 
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mt-2"> {/* Compact form with reduced padding */}
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Login</h2> {/* Reduced text size */}
          <form onSubmit={handleLogin} className="space-y-4"> {/* Reduced vertical spacing */}
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email (e.g., mca10057.23@bitmesra.ac.in)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Display message if the email format is correct */}
              {emailValid && <p className="text-green-500 mt-1">Email format is correct</p>}
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-3 text-center">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          {/* Register Link */}
          <p className="text-gray-600 text-center mt-4">
            New user?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
