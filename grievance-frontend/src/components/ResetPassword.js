import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Change here

const ResetPassword = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const resetToken = 'YOUR_TOKEN_HERE'; // Get the token from the URL or state

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your password reset logic here

    // Example: After successful reset, navigate to the login page
    if (password === confirmPassword) {
      // Assuming the password reset was successful
      setSuccess(true);
      navigate('/login'); // Use navigate to go to login page
    } else {
      setError('Passwords do not match');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      {success && <p>Password reset successful! You can now log in.</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
