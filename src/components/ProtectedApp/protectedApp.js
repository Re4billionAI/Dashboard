import Cookies from "js-cookie" 
import {  Navigate,Outlet  } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"
import Head from "../Header/head"
import Sitesbar from "../Sites/sitesbar"

import React, { useState } from "react";



const ProtectedRoute=(extraProps)=>{
  const [isOpen, setIsOpen] = useState(false);
  
    const toggleSidebar = () => {
   
      setIsOpen(!isOpen);
    };
   
 if (Cookies.get("token")) {
      if (Cookies.get("role") === extraProps.extraProps.name) {
        return  (<div className="flex flex-row h-screen ">
          
        <Sidebar /> {/* Navbar appears only after login */}
        <div className="w-full gap-4 h-screen overflow-y-auto bg-sky-100">
        <Sitesbar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
        <Head toggleSidebar={toggleSidebar}/>
        <Outlet /> {/* This will render Home (Admin) or User page */}
        </div>
      </div>)
      }return <Navigate to ="/login"/>
     
    }else{
        return <Navigate to ="/login"/>
    }

}
export default ProtectedRoute