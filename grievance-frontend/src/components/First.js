import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const First = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Fixed Header */}
      <header className="w-full bg-blue-500 text-white flex justify-center items-center h-32 relative shadow-lg">
        <img
          src="/Logo.jpg" // Make sure the logo is placed in the public folder
          alt="Logo"
          className="absolute left-0 ml-4 h-28 border-2 border-white shadow-md"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          BIRLA INSTITUTE OF TECHNOLOGY
        </h1>
      </header>

      {/* Body */}
      <div className="text-center mt-16">
        <h2 className="text-xl md:text-3xl font-semibold">
          Enter As A Student
        </h2>

        {/* Button Container */}
        <div className="flex flex-col justify-center mt-10 space-y-4">
          <Link
            to="/grievance-forum"
            className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg transition duration-300 hover:bg-blue-600 hover:scale-105"
          >
            Enter Student Grievance Forum
          </Link>
          <Link
            to="/grievance-form"
            className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg transition duration-300 hover:bg-blue-600 hover:scale-105"
          >
            Complain To Committee
          </Link>
          <Link
            to="/check-response"
            className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg transition duration-300 hover:bg-blue-600 hover:scale-105"
          >
            Check Response
          </Link>
        </div>
      </div>
    </div>
  );
};

export default First;
