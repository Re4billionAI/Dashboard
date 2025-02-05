import React from "react";
import { Sun, PlugZap, Zap, ArrowUp } from "lucide-react";

const EnergyConsumption = () => {
  return (
    <div className="flex flex-col p-2 pb-6  md:p-4 md:mb-4 mb-2 mx-4 md:mx-0 bg-white shadow-md rounded-2xl md:rounded-3xl gap-3">
      <h1 className="text-xl md:text-xl font-bold">Energy Consumptions</h1>
      
      <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between md:gap-1 w-auto gap-2 px-2 sm:gap-4 sm:w-full">
        
        {/* Solar Card */}
        <div className="bg-gradient-to-br from-blue-50  to-blue-200  border border-gray-300 rounded-2xl md:rounded-3xl px-3 py-2 md:pl-4 md:pt-4 md:pr-4 sm:w-1/4 w-full min-h-[120px] md:min-h-[140px] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col-reverse md:flex-row items-start  gap-6 justify-between p-1 md:p-2">
            <div>
              <h1 className="text-gray-500 text-lg md:text-xl "><span className="text-gray-600 text-lg md:text-md ">Solar</span><br/>Generation</h1>
              <p className="text-2xl md:text-2xl font-bold text-blue-600 mt-1">0.51kWh</p>
            </div>
            <div className="p-2 md:p-3 bg-white rounded-full">
              <Sun className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            </div>
          </div>
        </div>

       <div className="flex  flex-col gap-2 items-center justify-around w-[50%] md:w-[69%] w md:flex-row">
         {/* Grid Card */}
         <div className="bg-gradient-to-br  from-green-50 to-green-200 border border-gray-300 rounded-2xl md:rounded-3xl px-2 py-2 md:pl-4 md:pt-4 md:pr-4 md:w-1/3  min-h-[80px] md:min-h-[140px] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-row items-start justify-between p-1 md:p-2">
            <div>
              <h1 className="text-gray-600 text-sm md:text-xl ">Grid<br/>Energy</h1>
              <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">0.51kWh</p>
            </div>
            <div className="p-2 md:p-3 bg-white rounded-full">
              <PlugZap className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Consumption Card */}
        <div className=" bg-gradient-to-br from-red-50 to-red-200 border border-gray-300 rounded-2xl md:rounded-3xl px-2 py-2 md:pl-4 md:pt-4 md:pr-4 md:w-1/3 w-full min-h-[80px] md:min-h-[140px] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-row items-start justify-between p-1 md:p-2">
            <div>
              <h1 className="text-gray-600 text-xs md:text-xl">Load<br/>Consumptions</h1>
              <p className="text-xl md:text-2xl font-bold text-red-600 mt-1">0.51kWh</p>
            </div>
            <div className="p-2 md:p-3 bg-white rounded-full">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
          </div>
        </div>
       </div>
      </div>
    </div>
  );
};

export default EnergyConsumption;