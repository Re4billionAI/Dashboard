
import { Calendar, Download, MapPin, CheckCircle } from "lucide-react";

export default function StatusCard({device, alert,  lastupdate}) {
  const lasttime = new Date(lastupdate * 1000);
  
  return (
    <div className="md:m- mb-4 mx-4 md:mx-0 bg-white px-4 md:px-8 shadow-md p-6 rounded-xl md:rounded-3xl flex flex-row md:flex-row-2 items-center justify-between gap-4 md:gap-2">
      <div className="text-center md:w-auto md:text-left flex flex-col justify-center md:justify-end gap-6 md:gap-10 w-[50%] ">
        <p className="text-xs font-bold md:text-sm text-gray-500">
          Last Update: <br className="md:hidden"/> 
          <span className="font-bold md:font-semibold text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg">
            {lasttime.toLocaleString()}
          </span>
        </p>
        <button className={`flex flex-row items-center justify-center gap-1 md:gap-2 ${alert==="success"?"bg-green-500 ":"bg-red-500 " } text-white px-3 md:px-2 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md hover:bg-green-600 transition-all duration-300`}>
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> {alert==="success"?"online":"offline"}
        </button>
      </div>
      
      <div className="flex flex-col justify-center md:justify-end gap-6 md:gap-4 w-[60%] md:w-auto">
        <div className="flex w-[100%] flex-row justify-end md:justify-end gap-2 md:gap-4">
        
        <input 
  type="date" 
  className="w-[50%]  bg-white  outline-none text-gray-700 border border-gray-400  p-1 sm:p-1 rounded-full cursor-pointer transition-all duration-300"
/>



          <button className="flex items-center gap-1 md:gap-2 bg-white px-3 md:px-5 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md hover:bg-gray-200 transition-all duration-300 border border-gray-200">
            <Download className="w-4 h-4 md:w-5 md:h-5" /> 
            <span className="hidden md:block">Download</span>
          </button>
        </div>

        <div className="ml-auto inline-flex flex-row justify-center items-center gap-1 md:gap-2 bg-white px-3 md:px-5 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md border border-gray-200 max-w-full">
  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
  <span className="font-sm text-gray-700 text-md sm:text-sm md:text-md lg:text-md truncate">
    {device}
  </span>
</div>
      </div>
    </div>
  );
}
