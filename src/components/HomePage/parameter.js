import React from "react";
import { Sun, Zap, Battery, PlugZap } from "lucide-react";

const data = [
  { name:" Solar Voltage", icon: <Sun/>, color: "bg-blue-500" },
  {name:"Solar Current", icon: <Sun/>, color: "bg-blue-500" },
  {name:"Grid Voltage", icon: <PlugZap/>, color: "bg-green-500" },
  { name:"Grid Current", icon: <PlugZap/>, color: "bg-green-500" },
  { name:" Inverter Voltage", icon: <Zap/>, color: "bg-yellow-500" },
  { name:"Inverter Current", icon: <Zap/>, color: "bg-yellow-500" },
  { name:"Battery", icon: <Battery/>, color: "bg-purple-500" },
];

const Card = ({ icon, color, name }) => {
  return (
    <div className="bg-white w-[100%] border border-gray-300  rounded-xl p-3 flex flex-col  min-w-0 "> {/* Changed to full width */}
      <div className="flex justify-between items-center">
        <span className="text-gray-700 text-sm">{name}</span>
        <span className={`text-xl text-${color}`}>{icon}</span>
      </div>
      <p className="text-lg font-bold mt-1">0.51kWh</p>
      <div className=" w-full h-2 bg-gray-300 rounded-full mt-2">
        <div className={`relatve h-2 rounded-full ${color} w-2/5`}></div>
      </div>
    </div>
  );
};

const ParameterRepresentation = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 rounded-xl bg-white mx-4 md:mx-0"> {/* Responsive padding */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6"> {/* Responsive text */}
        Parameter Representation
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"> {/* Responsive grid */}
        {data.map((item, index) => (
          <Card key={index} icon={item.icon} name={item.name} color={item.color} />
        ))}
      </div>
    </div>
  );
};

export default ParameterRepresentation;