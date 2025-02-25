import React, { useState } from 'react';
import { Menu, Search, LogOut } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux'
import { updateLocation } from "../Redux/CounterSlice"

import { FiX, FiSearch } from "react-icons/fi";


import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const  locations= [
  { name: "Kollar-TN", path: "ftb001",board: "rms35_004",type:"24v", timeInterval:1 },
  { name: "Modaiyur-TN", path: "stb001", board: "stb001",type:"24v",timeInterval:1 },
  { name: "Ananthapuram-TN", path: "nrmsv2f001", board: "nrmsv2f001",type:"24v",timeInterval:5 },
  { name: "Vengur-TN", path: "rmsv3_001", board: "rmsv34_004",type:"24v",timeInterval:1 },
  { name: "Sithalingamadam-TN", path: "rmsv3_002", board: "rmsv34_004", type:"24v",timeInterval:1},
  { name: "Keelathalanur-TN", path: "rmsv32_001", board: "rmsv32_001", type:"24v",timeInterval:5},
  { name: "Perumukkal-TN", path: "rmsv33_001", board: "rmsv35_012",type:"24v",timeInterval:5 },
  { name: "Agalur-TN", path: "rmsv33_002", board: "rmsv34_005",type:"24v",timeInterval:5 },
  { name: "Melmalaiyanur-TN", path: "rmsv4_001", board: "rmsv4_001",type:"48v",timeInterval:1 },
  { name: "Saram-TN", path: "rmsv33_005", board: "rmsv33_005",type:"24v",timeInterval:1 },
  { name: "Pootai-TN", path: "rmsv34_002", board: "rmsv34_002",type:"24v",timeInterval:1 },
  { name: "Siruvanthadu-TN", path: "rmsv34_003", board: "rmsv34_003", type:"24v",timeInterval:1},
  { name: "Puthirampattu-TN", path: "rmsv35_002", board: "rmsv35_002", type:"24v",timeInterval:1},
  { name: "Vadalur-TN", path: "rmsv35_003", board: "rmsv35_003", type:"24v",timeInterval:1},
  { name: "Alagarai-TN", path: "rmsv35_007", board: "rmsv35_007",type:"24v",timeInterval:5 },
  { name: "Kanniyapuram-TN", path: "rmsv35_008", board: "rmsv35_008",type:"24v",timeInterval:5 },
  { name: "Thandavankulam-TN", path: "Thandavankulam-TN", board: "rmsv36_006",type:"48v",timeInterval:1 },
  { name: "Channamahgathihalli KA", path: "rmsv35_006", board: "rmsv35_006",type:"24v",timeInterval:5 },
  { name: "Jenugadde KA", path: "rmsv35_014", board: "rmsv35_014",type:"24v",timeInterval:5 },
  { name: "Sindigere KA", path: "rmsv35_015", board: "rmsv35_015", type:"24v",timeInterval:5},
  { name: "Panchalingala AP", path: "Panchalingala-AP", board: "rmsv36_001",type:"24v",timeInterval:5 },
  { name: "Nudurupadu-AP", path: "Nudurupadu-AP", board: "rmsv35_005", type:"24v",timeInterval:5},
  { name: "Laddagiri-AP", path: "Laddagiri-AP", board: "rmsv36_003",type:"24v",timeInterval:5 },
  { name: "Jambukuttapatti-TN", path: "Jambukuttapatti-TN", board: "rmsv36_009",type:"48v",timeInterval:5 },
  { name: "AyilapetaiKoppu-TN", path: "AyilapetaiKoppu-TN", board: "rmsv36_007",type:"24v",timeInterval:5 },
  { name: "Perumugai-TN", path: "Perumugai-TN", board: "rmsv36_010",type:"48v",timeInterval:5 },
  { name: "Chinnajatram-TG", path: "chjatram-TG", board: "rmsv36_008",type:"24v",timeInterval:5 },
];



const Head = ({ toggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);
  
  const [query, setQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

const dispatch=useDispatch()

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value) {
      const suggestions = locations.filter((location) =>
        location.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(suggestions);
    } else {
      setFilteredLocations([]);
    }
  };

  const changeLocation = (data) => {
 
    dispatch(updateLocation(data));
    setSelectedLocation(data);
   
    Cookies.set("locationName", data.name);
    Cookies.set("locationPath", data.path);
    Cookies.set("locationBoard", data.board);
    navigate("/");
    setShowSearch("")
    setQuery("")
    setFilteredLocations([])
    
  };

  
  // state to toggle search bar visibility

  const handleSearchClick = () => {
    setShowSearch(!showSearch); // toggle the search bar visibility
  };

  return (
    <div className="sticky md:w-full gap-2 mb-2 top-0 z-10 flex items-center justify-between px-6 py-4 backdrop-blur-md  bg-white md:bg-transparent ">
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
        


<div className="relative w-64">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search locations..."
        className="p-2 rounded-full border border-gray-300 pl-6"
      />
      {filteredLocations.length > 0 && (
        <ul className="absolute w-full bg-white border rounded mt-1 shadow">
          {filteredLocations.map((location, index) => (
            <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer"  onClick={() => changeLocation(location)}>
              {location.name}
            </li>
          ))}
        </ul>
      )}
    </div>






          <button className="border border-gray-200 bg-white p-2 rounded-full">
            <Search />
          </button>
        </div>

        {/* Mobile Search Toggle Icon */}
       

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden flex flex-row  items-center justify-end gap-0   w-[100%]">
         <div className="relative w-64">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search locations..."
        className="p-2 rounded-full  pl-6 w-[100%] border border-gray-20"
      />
      {filteredLocations.length > 0 && (
        <ul className="absolute w-full bg-white border rounded mt-1 shadow">
          {filteredLocations.map((location, index) => (
            <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer"  onClick={() => changeLocation(location)}>
              {location.name}
            </li>
          ))}
        </ul>
      )}
    </div>
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
        <button className="md:px-4 md:py-2 px-2 py-2 bg-blue-600 text-white rounded-full shadow-md flex items-center gap-2">
          <LogOut /> 
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Head;




