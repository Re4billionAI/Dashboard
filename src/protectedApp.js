import Cookies from "js-cookie" 
import {  Navigate,Outlet  } from "react-router-dom"

const ProtectedRoute=(extraProps)=>{
   console.log(extraProps)
 if (Cookies.get("token")) {
      if (Cookies.get("role") === extraProps.extraProps.name) {
        return <Outlet/>
      }return <Navigate to ="/login"/>
     
    }else{
        return <Navigate to ="/login"/>
    }

}
export default ProtectedRoute