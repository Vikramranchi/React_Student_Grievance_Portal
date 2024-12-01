// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
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
  );
};

export default Header;
