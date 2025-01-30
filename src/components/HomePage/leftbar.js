import React, { useState } from 'react';
import { TbSmartHome } from "react-icons/tb";
import { SiGoogleanalytics } from "react-icons/si";
import { FaMapLocationDot } from "react-icons/fa6";

const Sidebard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); 

    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);

    return (
        <div className={`flex ${isOpen ? 'flex-row' : 'flex-col'} transition-all duration-500 ease-in-out`} 
             onMouseEnter={handleMouseEnter} 
             onMouseLeave={handleMouseLeave}>
            <div className={`bg-sky-600 text-white h-screen p-4 ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300 ease-in-out`}>
                <div className={`mt-4 w-full h-full flex flex-col gap-8 items-center justify-start transition-all duration-300 ease-in-out`}>
                    {!isOpen ? (
                        <FaMapLocationDot className="text-3xl transform transition-transform duration-300 ease-in-out" />
                    ) : (
                        <div className="relative w-full">
                            <button className={`flex flex-row gap-2 ${isOpen ? "w-full " :"w-4/5"} items-center justify-center hover:bg-gray-700 rounded-xl`} 
                                    onClick={() => setMenuOpen(!menuOpen)}>
                                <FaMapLocationDot className="text-3xl transform transition-transform duration-300 ease-in-out" /> 
                                {isOpen && "Overview"}
                            </button>
                            {menuOpen && (
                                <div className="absolute top-5 left-full w-72 h-auto bg-white border rounded-lg shadow-lg transition-all duration-300 ease-in-out">
                                    <ul className="py-2">
                                        <li><h1>Item 1</h1></li>
                                        <li><h1>Item 2</h1></li>
                                        <li><h1>Item 3</h1></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    <button className={`flex flex-row gap-2 ${isOpen ? "w-full  " :"w-4/5"} items-center justify-center hover:bg-gray-700 rounded-xl`}>
                        <TbSmartHome className="text-3xl transform transition-transform duration-300 ease-in-out" /> 
                        {isOpen && "Home"}
                    </button>
                    <button className={`flex flex-row gap-2 ${isOpen ? "w-full" :"w-4/5"} items-center justify-center hover:bg-gray-700 rounded-xl`}>
                        <SiGoogleanalytics className="text-3xl transform transition-transform duration-300 ease-in-out" /> 
                        {isOpen && "Analytics"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebard;
