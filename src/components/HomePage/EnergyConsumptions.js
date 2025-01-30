import React from "react";
import { Sun, Battery, Zap, ArrowUp } from "lucide-react";

const EnergyConsumption = () => {
  return (
    <div className="flex flex-col p-3 md:p-4 md:mb-4 mb-2 mx-4 md:mx-0 bg-white shadow-md rounded-2xl md:rounded-3xl gap-3">
      <h1 className="text-xl md:text-xl font-bold">Energy Consumptions</h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-evenly md:gap-16 gap-2 px-6 sm:gap-4 sm:w-full">
        
        {/* Solar Card */}
        <div className="bg-gradient-to-br from-[#fcc287] to-[#FF8000] rounded-2xl md:rounded-3xl px-3 py-2 md:pl-4 md:pt-4 md:pr-4 sm:w-1/4 w-full min-h-[120px] md:min-h-[140px] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-row items-start justify-between p-1 md:p-2">
            <div>
              <h1 className="text-white text-lg md:text-2xl font-bold">Solar<br/>Generation</h1>
              <p className="text-2xl md:text-2xl font-bold text-white mt-1">0.51 kWh</p>
            </div>
            <div className="p-2 md:p-3 bg-[rgba(231,233,235,0.41)] rounded-full">
              <Sun className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Grid Card */}
        <div className="bg-gradient-to-br from-[#79A8FF] to-[#4269F5] rounded-2xl md:rounded-3xl px-3 py-2 md:pl-4 md:pt-4 md:pr-4 sm:w-1/4 w-full min-h-[120px] md:min-h-[140px] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-row items-start justify-between p-1 md:p-2">
            <div>
              <h1 className="text-white text-lg md:text-2xl font-bold">Grid<br/>Energy</h1>
              <p className="text-2xl md:text-2xl font-bold text-white mt-1">0.51 kWh</p>
            </div>
            <div className="p-2 md:p-3 bg-[rgba(231,233,235,0.41)] rounded-full">
              <Battery className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Consumption Card */}
        <div className="bg-gradient-to-br from-[#ff7979] to-[#de0505] rounded-2xl md:rounded-3xl px-3 py-2 md:pl-4 md:pt-4 md:pr-4 sm:w-1/4 w-full min-h-[120px] md:min-h-[140px] shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-row items-start justify-between p-1 md:p-2">
            <div>
              <h1 className="text-white text-lg md:text-2xl font-bold">Load<br/>Consumptions</h1>
              <p className="text-2xl md:text-2xl font-bold text-white mt-1">0.51 kWh</p>
            </div>
            <div className="p-2 md:p-3 bg-[rgba(231,233,235,0.41)] rounded-full">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyConsumption;