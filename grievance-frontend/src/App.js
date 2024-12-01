import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import First from './components/First';
import CommitteeLogin from './components/CommitteeLogin';
import CommitteePortal from './components/CommitteePortal';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import Registration from './components/Registration';
import GrievanceForm from './components/GrievanceForm'; // Import GrievanceForm component
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import CommitteeResponse  from './components/CommitteeResponse'; // Import ResetPassword component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/first" element={<First />} />
        <Route path="/committee-login" element={<CommitteeLogin />} />
        <Route path="/student-login" element={<Login />} />
        <Route path="/committee-portal" element={<CommitteePortal />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/grievance-form" element={<GrievanceForm />} /> {/* Add GrievanceForm route */}
        <Route path="/grievance-forum" element={<Dashboard />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        <Route path="/check-response" element={<CommitteeResponse />} /> 
        {/* Add ResetPassword route */}
      </Routes>
    </Router>
  );
}

export default App;
