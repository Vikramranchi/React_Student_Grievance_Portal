import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email,
      });
      if (response.status === 200) {
        setMessage('Reset link sent to your email.');
        setEmail(''); // Clear the email input after successful submission
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    } catch (error) {
      // Provide specific feedback based on the error response
      if (error.response) {
        setError(error.response.data.message || 'Error sending reset link. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    }
};


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {message && <p className="text-center text-green-500 mb-4">{message}</p>}
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Enter your email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 transition"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
