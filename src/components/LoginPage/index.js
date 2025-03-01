import React, { useEffect, useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [PasswordType, setPasswordType] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      if (Cookies.get("role") === "Admin") {
        window.location.href = "/";
      }
      if (Cookies.get("role") === "User") {
        window.location.href = "/User";
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter all the fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST}/login`, {
        email,
        password,
      });
     
      const token = response.data.data.token;
      const role = response.data.data.role;
      
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      if (role === "Admin") {
        window.location.href = "/";
      }
      if (role === "User") {
        const location = response.data.data.location;
        Cookies.set("selectedItem", password);
        Cookies.set("selectedLocation", location);
        window.location.href = "/User";
      }
    } catch (error) {
      console.error("Error signing up:", error);
      console.log({error})
      setError("Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center  bg-no-repeat relative"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dky72aehn/image/upload/v1740747416/2151896739_zlpzrv.jpg')" }}>
 {/* Dark overlay for contrast */}
 <div className="absolute inset-0 bg-black bg-opacity-20"></div>

 {/* Top Bar */}
 <div className="relative z-10 flex items-center justify-between p-4 md:p-6">
   <div className="text-white text-2xl font-bold">Re4billion</div>
   
 </div>

 {/* Main Content Container */}
 <div className="relative z-10 flex flex-col md:flex-row justify-around items-center px-4 md:px-8 py-8 md:py-16">
   {/* Left Side: Heading & Stats */}
   <div className="md:w-1/2 text-white mb-8 md:mb-0 md:mr-8">
     <h1 className="text-3xl md:text-5xl font-bold mb-4">
       Welcome to the Future of Energy
     </h1>
     <p className="text-lg md:text-xl mb-6">
       Join thousands of environmentally conscious users managing their
       sustainable energy solutions through our innovative platform.
     </p>
     <div className="flex space-x-8">
       <div>
         <p className="text-xl md:text-2xl font-bold">500K+</p>
         <p className="text-sm md:text-base">Solar Installations</p>
       </div>
       <div>
         <p className="text-xl md:text-2xl font-bold">1M+</p>
         <p className="text-sm md:text-base">CO2 Reduced</p>
       </div>
     </div>
   </div>

   {/* Right Side: Login Form */}
   <div className="bg-white w-full md:w-1/3 max-w-md p-6 rounded-3xl shadow-lg bg">
     <h2 className="text-center text-xl font-bold mb-4">Sign in to EcoEnergy</h2>
     <form className="space-y-4">
       <div>
         <label htmlFor="email" className="block font-medium mb-1">Email</label>
         <input
           type="email"
           id="email"
           placeholder="Enter your email"
           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
           required
         />
       </div>
       <div>
         <label htmlFor="password" className="block font-medium mb-1">Password</label>
         <input
           type="password"
           id="password"
           placeholder="Enter your password"
           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
           required
         />
       </div>
       <div className="flex items-center justify-between text-sm">
         <label className="flex items-center space-x-2">
           <input type="checkbox" className="form-checkbox h-4 w-4" />
           <span>Remember me</span>
         </label>
        
       </div>
       <button
         type="submit"
         className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
       >
         Sign in
       </button>
     </form>
   
   
   </div>
 </div>

 {/* Footer */}
 
</div>
  );
};

export default Login;
