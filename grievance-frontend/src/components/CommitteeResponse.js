import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function CommitteeResponse() {
  const [grievances, setGrievances] = useState([]);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  // Function to load user information from the JWT token
  const loadUserFromToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const decodedToken = jwtDecode(token);
          setUserEmail(decodedToken.email);
        } else {
          throw new Error('Invalid token format');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Failed to load user information');
      }
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const loadGrievancesAndResponses = async () => {
      setLoading(true);
      try {
        const grievancesResponse = await axios.get(`https://react-student-grievance-portal-7.onrender.com/api/grievances?email=${userEmail}`);
        setGrievances(grievancesResponse.data);

        const responsesResponse = await axios.get(`https://react-student-grievance-portal-7.onrender.com/api/responses?email=${userEmail}`);
        setResponses(responsesResponse.data);
      } catch (error) {
        setError('Failed to load grievances and responses. Please try again later.');
        console.error('Error fetching grievances and responses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGrievancesAndResponses();
  }, [userEmail]);

  const getResponsesForGrievance = (grievanceId) => {
    return responses.filter((response) => response.grievanceId === grievanceId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-blue-500 text-white flex justify-center items-center h-32 relative shadow-lg">
        <img
          src="/Logo.jpg"
          alt="Logo"
          className="absolute left-0 ml-4 h-28 border-2 border-white shadow-md"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-center">BIRLA INSTITUTE OF TECHNOLOGY</h1>
      </header>

      <div className="container mx-auto p-6">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <h2 className="text-3xl font-bold mb-6 text-center">Grievances & Responses</h2>

        {!userEmail && (
          <div className="text-center text-red-500">
            <p>Please log in to view grievances and responses.</p>
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grievances.map((grievance) => (
              <div key={grievance._id} className="grievance-box p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-2">Name: {grievance.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Course: {grievance.course}</p>
                <p className="text-lg text-red-500 mb-4">Description: {grievance.description}</p>
                <p className="text-sm text-gray-600">Category: {grievance.category}</p>
                <p className="text-sm text-gray-600">Program: {grievance.program}</p>
                <p className="text-sm text-gray-600 mb-4">Roll No: {grievance.rollNo}</p>
                <p className="text-xs text-gray-400">
                  Timestamp: {new Date(grievance.timestamp).toLocaleString()}
                </p>

                <hr className="my-4" />

                {getResponsesForGrievance(grievance._id).length > 0 ? (
                  getResponsesForGrievance(grievance._id).map((response) => (
                    <div key={response._id} className="mt-4">
                      <h4 className="text-lg font-semibold text-blue-600">Committee Response:</h4>
                      <p className="text-blue-500 text-lg">{response.responseText}</p>
                      <p className="text-xs text-gray-400">
                        Response Timestamp: {new Date(response.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No response yet</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommitteeResponse;
