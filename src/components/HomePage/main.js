
import React, { useState } from "react";
import { Menu, X, Search, LogOut } from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./sidebar";
import StatusCard from "./statusCard";
import EnergyConsumption from "./EnergyConsumptions";
import Head from "./head";
import ParameterRepresentation from "./parameter";

const Home = () => {
   const [isOpen, setIsOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  return (
   <div className="flex flex-row  bg-[#EBF3FD] w-full ">
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
     <Navbar/>
     <div className="w-full h-screen  flex flex-col md:px-6 gap-0 overflow-y-auto pb-[60px] md:pb-0">
  <Head toggleSidebar={toggleSidebar}/>
  <StatusCard/>
  <EnergyConsumption/>
  <ParameterRepresentation/>
</div>
   </div>
  )
};

export default Home;
