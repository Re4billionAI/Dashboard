import React, { useState } from 'react';
import { Menu, Search, LogOut } from "lucide-react";

const Head = ({ toggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false); // state to toggle search bar visibility

  const handleSearchClick = () => {
    setShowSearch(!showSearch); // toggle the search bar visibility
  };

  return (
    <div className="sticky md:w-full gap-2 mb-4 top-0 z-10 flex items-center justify-between p-4 backdrop-blur-md  bg-white md:bg-transparent ">
      {/* Left Section - Company Logo & Sidebar Toggle */}
      <div className="flex items-center gap-2">
          {/* Sidebar Toggle Button */}
          <button
          onClick={toggleSidebar}
          className="p-2 bg-blue-600 text-white rounded-md shadow-md flex items-center"
        >
          <Menu size={20} />
        </button>
        {/* Company Logo */}
        <img 
          src="https://res.cloudinary.com/dky72aehn/image/upload/v1738137266/Screenshot_2025-01-29_132015-removebg-preview_hc6g3y.png" // Replace with your logo's path
          alt="Company Logo" 
          className="w-10 h-10 object-contain md:hidden" 
        />
        
      
      </div>

      {/* Center Section - Search Bar */}
      
      <div className="flex items-center gap-2 flex-grow justify-end md:justify-start w-[50%] ">
        {/* Desktop Search Bar (always visible on desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <input 
            placeholder="Search..." 
            className="p-2 rounded-full border border-gray-300 pl-6" 
          />
          <button className="border border-gray-200 bg-white p-2 rounded-full">
            <Search />
          </button>
        </div>

        {/* Mobile Search Toggle Icon */}
       

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden flex flex-row  items-center justify-end gap-0   w-[100%]">
            <input 
              placeholder="Search..." 
              className="p-2 rounded-full  pl-6 w-[100%] border border-gray-20" 
            />
          </div>
        )}
         <button 
          onClick={handleSearchClick} 
          className="md:hidden  bg-white p-2 border border-gray-200 rounded-full">
          <Search />
        </button>
      </div>

      {/* Right Section - Logout Button */}
      <div className="flex items-center">
        <button className="p-2 bg-blue-600 text-white rounded-md shadow-md flex items-center gap-2">
          <LogOut /> 
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Head;
