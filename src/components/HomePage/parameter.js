import React from "react";
import { Sun, Zap, Battery, PlugZap } from "lucide-react";

const data = [
  { name: "Solar Voltage", icon: <Sun />,  value:"solarVoltage", measure:"V" },
  { name: "Solar Current", icon: <Sun />,   value:"solarCurrent",  measure:"A" },
  { name: "Inverter Voltage", icon: <Zap />,   value:"inverterVoltage",  measure:"V" },
  { name: "Inverter Current", icon: <Zap />,   value:"inverterCurrent",  measure:"A" },
  { name: "Grid Voltage", icon: <PlugZap />,   value:"gridVoltage",  measure:"V" },
  { name: "Grid Current", icon: <PlugZap />,   value:"gridCurrent",  measure:"A" },
  { name: "Battery", icon: <Battery />,   value:"batteryVoltage",  measure:"V" },
];

const Card = ({ icon, name, value, measure }) => {
  let widthPercentage 
let color

if (name==="Solar Voltage"){
  if (value < 30) {
    color = "bg-red-500"; // Low value
    widthPercentage = "25%";
  } else if (value > 90) {
    color = "bg-yellow-500"; // High value
    widthPercentage = "100%";
  }else{
    color = "bg-green-500"; // High value
    widthPercentage = "50%"
  }
} // Default width


if (name==="Solar Current"){
  if (value < 4) {
    color = "bg-red-500"; // Low value
    widthPercentage = "25%";
  } else if (value > 10) {
    color = "bg-yellow-500"; // High value
    widthPercentage = "100%";
  }else{
    color = "bg-green-500"; // High value
    widthPercentage = "50%"
  }
} // Default width

if (name==="Inverter Voltage"){
  if (value < 150) {
    color = "bg-red-500"; // Low value
    widthPercentage = "25%";
  } else if (value > 200) {
    color = "bg-yellow-500"; // High value
    widthPercentage = "100%";
  }else{
    color = "bg-green-500"; // High value
    widthPercentage = "50%"
  }
} // Default width

if (name==="Inverter Current"){
  if (value < 2) {
    color = "bg-red-500"; // Low value
    widthPercentage = "25%";
  } else if (value > 4) {
    color = "bg-yellow-500"; // High value
    widthPercentage = "100%";
  }else{
    color = "bg-green-500"; // High value
    widthPercentage = "50%"
  }
}


if (name==="Grid Voltage"){
  if (value < 150) {
    color = "bg-red-500"; // Low value
    widthPercentage = "25%";
  } else if (value > 240) {
    color = "bg-yellow-500"; // High value
    widthPercentage = "100%";
  }else{
    color = "bg-green-500"; // High value
    widthPercentage = "50%"
  }
}
  
if (name==="Grid Current"){
  if (value < 3) {
    color = "bg-red-500"; // Low value
    widthPercentage = "25%";
  } else if (value > 6) {
    color = "bg-yellow-500"; // High value
    widthPercentage = "100%";
  }else{
    color = "bg-green-500"; // High value
    widthPercentage = "50%"
  }
}
if (name==="Battery"){
  if (value < 20) {
    color = "bg-red-500"; // Low value
    widthPercentage = "25%";
  } else if (value > 25) {
    color = "bg-yellow-500"; // High value
    widthPercentage = "100%";
  }else{
    color = "bg-green-500"; // High value
    widthPercentage = "50%"
  }
}
  

  return (
    <div className="bg-white w-full border border-gray-300 rounded-xl p-3 flex flex-col min-w-0">
      <div className="flex justify-between items-center">
        <span className="text-gray-700 text-sm">{name}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-lg font-bold mt-1">{`${value.toFixed(2)} ${measure}`}</p>
      <div className="w-full h-2 bg-gray-300 rounded-full mt-2">
        <div
          className={`relative h-2 rounded-full ${color}`}
          style={{ width: widthPercentage }}
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
              value={parameterValue} 
              measure={item.measure}// Default to "N/A" if no data
            />
          );
        })}
      </div>
    </div>
  );
};

export default ParameterRepresentation;
