import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/banner.png')` }}  // Access banner from the public folder
    >
      {/* Fixed Header */}
      <header className="bg-blue-500 text-white flex justify-center items-center h-28 fixed w-full top-0 z-50 shadow-lg">
        <img
          src="/logo.jpg"  // Access logo from the public folder
          alt="Logo"
          className="absolute left-0 ml-4 h-24 border-2 border-white shadow-md"
        />
        <h1 className="text-3xl font-bold">Welcome To BIT MESRA</h1>
      </header>

      {/* Body */}
      <div className="text-center mt-36 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Welcome to BIT Mesra Grievance Portal
        </h2>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center mt-20 space-y-4 md:space-y-0 md:space-x-8">
          <Link
            to="/student-login"
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-lg transition duration-300 transform hover:scale-105 hover:bg-blue-600"
          >
            Login As Student
          </Link>
          <Link
            to="/committee-login"
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-lg transition duration-300 transform hover:scale-105 hover:bg-blue-600"
          >
            Login As Committee Member
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
