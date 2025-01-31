import Cookies from "js-cookie" 
import {  Navigate,Outlet  } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"

const ProtectedRoute=(extraProps)=>{
   
 if (Cookies.get("token")) {
      if (Cookies.get("role") === extraProps.extraProps.name) {
        return  (<div className="flex flex-row h-screen ">
        <Navbar /> {/* Navbar appears only after login */}
        <Outlet /> {/* This will render Home (Admin) or User page */}
      </div>)
      }return <Navigate to ="/login"/>
     
    }else{
        return <Navigate to ="/login"/>
    }

}
export default ProtectedRoute