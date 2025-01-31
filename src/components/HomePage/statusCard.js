import { useState } from "react";
import { Calendar, Download, MapPin, CheckCircle } from "lucide-react";

export default function StatusCard() {
  const [location, setLocation] = useState("perumukkal");
  
  return (
    <div className="md:m- mb-4 mx-4 md:mx-0 bg-white px-4 md:px-8 shadow-md p-6 rounded-xl md:rounded-3xl flex flex-row md:flex-row-2 items-center justify-between gap-4 md:gap-2">
      <div className="text-center md:w-auto md:text-left flex flex-col justify-center md:justify-end gap-6 md:gap-10">
        <p className="text-xs font-bold md:text-sm text-gray-500">
          Last Update: <br className="md:hidden"/> 
          <span className="font-bold md:font-semibold text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg">
            12-01-25, 12:25
          </span>
        </p>
        <button className="flex flex-row items-center justify-center gap-1 md:gap-2 bg-green-200 text-green-700 px-3 md:px-2 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md hover:bg-green-600 transition-all duration-300">
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Online
        </button>
      </div>
      
      <div className="flex flex-col justify-center md:justify-end gap-6 md:gap-4 w-[60%] md:w-auto">
        <div className="flex flex-row justify-end md:justify-end gap-2 md:gap-4">
          <button className="flex items-center gap-1 md:gap-2 w-auto bg-white px-3 md:px-5 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md hover:bg-gray-200 transition-all duration-300 border border-gray-200">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" /> 11-02-25
          </button>

          <button className="flex items-center gap-1 md:gap-2 bg-white px-3 md:px-5 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md hover:bg-gray-200 transition-all duration-300 border border-gray-200">
            <Download className="w-4 h-4 md:w-5 md:h-5" /> 
            <span className="hidden md:block">Download</span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1 md:gap-2 bg-white px-3 md:px-5 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md border border-gray-200">
          <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> 
          <span className="font-medium md:font-semibold text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg">
            {location}
          </span>
        </div>
      </div>
    </div>
  );
}
