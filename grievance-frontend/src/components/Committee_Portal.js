import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Header Component
const Header = ({ onLogout }) => {
  return (
    <div className="flex justify-between items-center bg-blue-600 text-white p-4">
      <img src="Logo.jpg" alt="Logo" className="h-10" />
      <h1 className="text-xl font-bold">BIT COMMITTEE FORUM</h1>
      <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

// Left Panel Component
const LeftPanel = ({ onSortByDate, onSortByCategory }) => {
  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-lg">
      <h4 className="font-bold text-lg mb-4">Sort Grievances</h4>
      <button onClick={onSortByDate} className="bg-blue-500 text-white px-4 py-2 w-full mb-2 rounded">
        Sort by Date
      </button>
      <button onClick={onSortByCategory} className="bg-blue-500 text-white px-4 py-2 w-full rounded">
        Sort by Category
      </button>
    </div>
  );
};

// Grievance Box Component
const GrievanceBox = ({ grievanceData, onSubmitResponse }) => {
  const [responseText, setResponseText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResponseChange = (e) => {
    setResponseText(e.target.value);
  };

  const handleSubmitResponse = () => {
    onSubmitResponse(grievanceData, responseText);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return null; // Hide grievance box after response is submitted
  }

  return (
    <div className="grievance-box border rounded p-4 mb-4 bg-white shadow">
      <h4 className="font-bold">Category: {grievanceData.category}</h4>
      <p>
        <strong>Name:</strong> {grievanceData.name}<br />
        <strong>Roll No:</strong> {grievanceData.rollNo}<br />
        <strong>Course:</strong> {grievanceData.course}<br />
        <strong>Program:</strong> {grievanceData.program}<br />
        <strong>Phone Number:</strong> {grievanceData.phoneNumber}<br />
        <strong>Email:</strong> {grievanceData.email}<br />
        <strong>Description:</strong> {grievanceData.description}<br />
        <strong>Timestamp:</strong> {new Date(grievanceData.timestamp).toLocaleString()}
      </p>

      <div className="mt-4">
        <textarea
          placeholder="Enter your response..."
          value={responseText}
          onChange={handleResponseChange}
          className="w-full p-2 border rounded mb-2"
        ></textarea>
        <button onClick={handleSubmitResponse} className="bg-green-500 text-white px-4 py-2 rounded">
          Submit Response
        </button>
      </div>
    </div>
  );
};

// Grievance Container Component
const GrievanceContainer = ({ sortedGrievances, onSubmitResponse }) => {
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Grievances Log</h2>
      <div id="grievanceContainer">
        {sortedGrievances.length === 0 ? (
          <div>No grievances available to display</div>
        ) : (
          sortedGrievances.map(grievance => (
            <GrievanceBox
              key={grievance._id}
              grievanceData={grievance}
              onSubmitResponse={onSubmitResponse}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Main CommitteePortal Component
const CommitteePortal = () => {
  const [grievances, setGrievances] = useState([]);
  const [sortedGrievances, setSortedGrievances] = useState([]);

  const fetchGrievances = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/grievances');
      console.log('Fetched grievances:', response.data); // Log the response data
      setGrievances(response.data);
      setSortedGrievances(response.data); // Initialize sorted grievances
    } catch (error) {
      console.error("Error fetching grievances:", error);
    }
  };

  const submitResponse = async (grievanceData, responseText) => {
    try {
      console.log('Submitting response:', {
        email: grievanceData.email,
        grievanceId: grievanceData._id,
        responseText,
        timestamp: new Date(),
      });

      const response = await axios.post('http://localhost:5000/api/responses', {
        email: grievanceData.email,
        grievanceId: grievanceData._id,
        responseText,
        timestamp: new Date(),
      });

      if (response.status === 200) {
        alert("Response submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      alert('Error submitting response');
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const sortByDate = () => {
    const sorted = [...grievances].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    console.log('Sorted by date:', sorted);
    setSortedGrievances(sorted);
  };

  const sortByCategory = () => {
    const sorted = [...grievances].sort((a, b) => a.category.localeCompare(b.category));
    console.log('Sorted by category:', sorted);
    setSortedGrievances(sorted);
  };

  const handleLogout = () => {
    alert("User logged out");
    // Optionally redirect or remove user session
  };

  return (
    <div className="container mx-auto p-4">
      <Header onLogout={handleLogout} />
      <div className="flex flex-col lg:flex-row mt-6">
        <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
          <LeftPanel 
            onSortByDate={sortByDate} 
            onSortByCategory={sortByCategory} 
          />
        </div>
        <div className="w-full lg:w-3/4">
          <GrievanceContainer
            sortedGrievances={sortedGrievances}
            onSubmitResponse={submitResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default CommitteePortal;
