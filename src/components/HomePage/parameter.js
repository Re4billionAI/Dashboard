import React from "react";

const data = [
  { icon: "💡", color: "bg-blue-500" },
  { icon: "💡", color: "bg-blue-500" },
  { icon: "⚡", color: "bg-green-500" },
  { icon: "⚡", color: "bg-green-500" },
  { icon: "🔒", color: "bg-yellow-500" },
  { icon: "🔒", color: "bg-yellow-500" },
  { icon: "🔄", color: "bg-purple-500" },
];

const Card = ({ icon, color }) => {
  return (
    <div className="bg-white w-[90%] shadow-lg border border-gray-300  rounded-xl p-4 flex flex-col  min-w-0 "> {/* Changed to full width */}
      <div className="flex justify-between items-center">
        <span className="text-gray-700 text-sm">Load Consumption</span>
        <span className="text-2xl">{icon}</span>
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
          <Card key={index} icon={item.icon} color={item.color} />
        ))}
      </div>
    </div>
  );
};

export default ParameterRepresentation;