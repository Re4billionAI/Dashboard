import React, { useState, useEffect } from "react";
import { Home, Bell, Settings, Grid, LogOut, User } from "lucide-react";

const Navbar = () => {
 

  // Function to handle scroll events
 

  return (
    <>
      {/* Sidebar for larger screens */}
      <nav className="hidden md:flex w-80 h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex-col rounded-r-3xl shadow-xl border-r border-gray-100">
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dky72aehn/image/upload/v1738137266/Screenshot_2025-01-29_132015-removebg-preview_hc6g3y.png"
              alt="logo"
              className="w-12 h-12 rounded-xl shadow-sm"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Re4billion
            </h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 gap-1">
          {[{ icon: Home, label: "Home", active: true }, { icon: Grid, label: "Dashboard" }, { icon: Bell, label: "Alerts" }, { icon: Settings, label: "Settings" }].map(
            (item, index) => (
              <button
                key={index}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-medium transition-all
                ${item.active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-white hover:shadow-md hover:text-blue-600"}`}
              >
                <item.icon size={20} className={item.active ? "text-white" : "text-current"} />
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>

        <div className="mt-auto p-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl hover:bg-white transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">John Anderson</p>
              <p className="text-xs text-gray-500">john@re4billion.com</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-6 py-3.5 text-gray-600 hover:text-red-600 rounded-xl text-sm font-medium transition-colors">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div
        className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around py-3 border-t border-gray-200 transition-transform duration-300 "
      >
        {[{ icon: Home, label: "Home", active: true }, { icon: Grid, label: "Dashboard" }, { icon: Bell, label: "Alerts" }, { icon: Settings, label: "Settings" }].map(
          (item, index) => (
            <button key={index} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <item.icon size={24} />
              <span className="text-xs">{item.label}</span>
            </button>
          )
        )}
      </div>
    </>
  );
};

export default Navbar;
