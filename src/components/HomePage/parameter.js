import React from "react";
import { Sun, Zap, Battery, PlugZap } from "lucide-react";

const data = [
  { name: "Solar Voltage", icon: <Sun />, color: "bg-blue-500", value:"solarVoltage" },
  { name: "Solar Current", icon: <Sun />, color: "bg-blue-500",  value:"solarCurrent" },
  { name: "Inverter Voltage", icon: <Zap />, color: "bg-yellow-500",  value:"inverterVoltage" },
  { name: "Inverter Current", icon: <Zap />, color: "bg-yellow-500",  value:"inverterCurrent" },
  { name: "Grid Voltage", icon: <PlugZap />, color: "bg-green-500",  value:"gridVoltage" },
  { name: "Grid Current", icon: <PlugZap />, color: "bg-green-500",  value:"gridCurrent" },
  { name: "Battery", icon: <Battery />, color: "bg-purple-500",  value:"batteryVoltage" },
];

const Card = ({ icon, color, name, value }) => {
  console.log({"value":value})
  return (
    <div className="bg-white w-full border border-gray-300 rounded-xl p-3 flex flex-col min-w-0">
      <div className="flex justify-between items-center">
        <span className="text-gray-700 text-sm">{name}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-lg font-bold mt-1">{value.toFixed(2)} kWh</p>
      <div className="w-full h-2 bg-gray-300 rounded-full mt-2">
        <div
          className={`relative h-2 rounded-full ${color} w-2/5`}
        ></div>
      </div>
    </div>
  );
};

const ParameterRepresentation = ({ parameters }) => {
  console.log(parameters)
  return (
    <div className="p-4 md:p-6 lg:p-8 rounded-xl bg-white mx-4 md:mx-0">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
        Parameter Representation
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {data.map((item, index) => {
           const parameterValue = parameters[item.value] ?? "N/A"; // Fetch value dynamically, default to "N/A"
          return (
            <Card
              key={index}
              icon={item.icon}
              name={item.name}
              color={item.color}
              value={parameterValue} // Default to "N/A" if no data
            />
          );
        })}
      </div>
    </div>
  );
};

export default ParameterRepresentation;
