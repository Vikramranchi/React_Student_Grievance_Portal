// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(''); // Email-specific error
  const [passwordError, setPasswordError] = useState(''); // Password-specific error
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // Confirm password-specific error
  const [generalError, setGeneralError] = useState(''); // General error message
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();
 const emailPattern = /^[a-zA-Z]{1,5}\d{1,5}\.\d{2}@bitmesra\.ac\.in$/;
 
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (emailPattern.test(value)) {
      setEmailValid(true);
      setEmailError(''); // Clear email-specific error
    } else {
      setEmailValid(false);
      setEmailError('Email format should be like mca10057.23@bitmesra.ac.in');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (passwordPattern.test(value)) {
      setPasswordValid(true);
      setPasswordError(''); // Clear password-specific error
    } else {
      setPasswordValid(false);
      setPasswordError('Password must contain at least one letter, one number, one special character, and be at least 10 characters long.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    } else {
      setConfirmPasswordError(''); // Clear the confirm password error if they match
    }

    if (!emailValid) {
      setGeneralError('Please fix the errors before submitting.');
      return;
    }

    if (!passwordValid) {
      setGeneralError('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await fetch('https://react-student-grievance-portal-7.onrender.com/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful');
        navigate('/login');
      } else {
        setGeneralError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Header */}
      <Header className="fixed top-0 left-0 w-full z-10" />
      <div className="flex flex-grow justify-center items-center pt-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Register</h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email (e.g., mca10057.23@bitmesra.ac.in)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Show email-specific error below the input field */}
              {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
              {emailValid && <p className="text-green-500 mt-1">Email format is correct</p>}
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Show password-specific error below the input field */}
              {passwordError && <p className="text-red-500 mt-1">{passwordError}</p>}
              {passwordValid && <p className="text-green-500 mt-1">Password is strong</p>}
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {/* Show confirm password-specific error below the input field */}
              {confirmPasswordError && <p className="text-red-500 mt-1">{confirmPasswordError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </form>
          {/* Show general error message */}
          {generalError && <p className="text-red-500 text-center mt-4">{generalError}</p>}
        </div>
      </div>
    </div>
  );
};

export default Registration;
