import React, { useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { FiX } from "react-icons/fi"; // Make sure to import react-icons
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { Maximize2, ChevronDown } from 'lucide-react';

// Define tooltip colors for the four Battery properties
const tooltipProps = {
  BatteryVoltage: { color: "blue" },
  BatteryVoltage2: { color: "green" },
  BatteryVoltage3: { color: "red" },
  BatteryVoltage4: { color: "purple" },
};

// Format the X-axis ticks (time labels)
const formatTick = (tick) => {
  if (!tick || typeof tick !== "string") return "";
  const [hourStr, minuteStr] = tick.split(":");
  if (!hourStr || !minuteStr) return tick;
  let hour = parseInt(hourStr, 10);
  let minute = parseInt(minuteStr, 10);
  if (isNaN(hour) || isNaN(minute)) return tick;
  minute = minute < 10 ? `0${minute}` : minuteStr;
  hour = hour < 10 ? `0${hour}` : hour;
  return hour === 24 ? `00:${minute}` : `${hour}:${minute}`;
};

// Map Battery keys to their respective units
const units = {
  BatteryVoltage: "V",
  BatteryVoltage2: "V", // For example, if representing current
  BatteryVoltage3: "V", // For example, if representing power
  BatteryVoltage4: "V", // Adjust unit as needed
};

// Custom Tooltip component displaying Battery units
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 p-2 rounded-md shadow-sm">
        <p className="font-semibold">{`Time: ${label}`}</p>
        {payload.map((item, index) => (
          <p key={index} style={{ color: item.color }}>
            {`${item.name}: ${
              item.value !== undefined ? item.value : "N/A"
            } ${units[item.name] || ""}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};



// Battery keys now include the fourth property
const batteryKeys = [
  "BatteryVoltage",
  "BatteryVoltage2",
  "BatteryVoltage3",
  "BatteryVoltage4",
];

// Define categories for modal use
const categories = {
  Battery: batteryKeys
};

const BatteryGraph = ({ graphValues }) => {
 
  const site = useSelector((state) => state.location.device);
console.log(site)
   const checkLocation=site.type==="48v"||site.name==="Thandavankulam-TN"?true:false
  console.log(checkLocation)
  const [visibility, setVisibility] = useState({
    Battery: {
      showVoltage: true,
      showVoltage2: true,
      showVoltage3: true,
      showVoltage4: true,
    },
  });
  
  // State for active modal
  const [activeModal, setActiveModal] = useState(null);

  // Handle modal toggle
  const handleModalToggle = (modalName) => {
    setActiveModal(modalName);
  };

  // Toggle visibility for parameters
  const handleCheckboxChange = useCallback((category, key, checked) => {
    setVisibility((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: checked,
      },
    }));
  }, []);

  // Dynamically calculate Y-axis domain based on visible parameters
  const calculateYDomain = (category = "Battery", categoryKeys = batteryKeys) => {
    const activeKeys = categoryKeys.filter((key, index) => {
      if (index === 0) return visibility[category]?.showVoltage;
      if (index === 1) return visibility[category]?.showVoltage2;
      if (index === 2) return visibility[category]?.showVoltage3;
      if (index === 3) return visibility[category]?.showVoltage4;
      return false;
    });

    if (activeKeys.length === 0) {
      return [0, 100];
    }

    const values = graphValues.flatMap((data) =>
      activeKeys.map((key) => data[key] || 0)
    );

    const max = values.length ? Math.max(...values) : 100;
    return [0, max + 20];
  };



  let parameters
  // Define the parameters for toggling Battery readings
  if (checkLocation===true){
     parameters = [
      { label: "Voltage1", key: "showVoltage", index: 0 },
      { label: "Voltage2", key: "showVoltage2", index: 1 },
      { label: "Voltage3", key: "showVoltage3", index: 2 },
      { label: "Voltage4", key: "showVoltage4", index: 3 },
    ];
  }else{
    parameters = [
      { label: "Voltage1", key: "showVoltage", index: 0 },
     
    ];
  }



  return (
    <>
      <div className="bg-white  rounded-3xl border w-full sm:w-[49%] border-gray-200 overflow-hidden mb-6">
        <div className="flex justify-between items-center p-4 bg-gray-50 border border-b-gray-300 rounded-t-lg">
          <h3 className="md:text-lg text-sm text-black font-bold">
            Battery Readings
          </h3>
          <div className="flex gap-2">
          <div className="relative group inline-block">
  {/* Tooltip trigger */}
  <div className="cursor-pointer px-2 py-1 flex bg-gray-200 rounded-full text-sm">
     Options <ChevronDown/>
  </div>

  {/* Tooltip content */}
  <div className="absolute hidden group-hover:block z-10 mt-0 p-3 bg-white border rounded-lg shadow-lg min-w-[160px] transform -translate-x-14 space-y-3">
    <div className="flex flex-col gap-1">
      {parameters.map((param) => {
        const dataKey = batteryKeys[param.index];
        const color = tooltipProps[dataKey].color;
        return (
          <button
            key={param.key}
            onClick={() =>
              handleCheckboxChange(
                "Battery",
                param.key,
                !visibility.Battery[param.key]
              )
            }
            style={{
              backgroundColor: visibility.Battery[param.key]
                ? color
                : "transparent",
              border: `2px solid ${
                visibility.Battery[param.key] ? color : "black"
              }`,
              color: visibility.Battery[param.key] ? "white" : "black",
            }}
            className="w-full px-1 py-1 rounded-full text-sm transition-colors flex items-center justify-center"
          >
            {param.label}
          </button>
        );
      })}
    </div>
  </div>
</div>
            <button 
                    onClick={() => handleModalToggle("Battery")}
                    className="text-gray-600 bg-white rounded-lg md:block hidden border border-gray hover:text-gray-800 p-2 hover:bg-gray-100"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
          </div>
        </div>
        <div className="p-0 pb-5 relative z-1">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={graphValues}
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="ccAxisXValue"
                tickFormatter={formatTick}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={calculateYDomain()}
                tickCount={10}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat().format(Math.round(value))
                }
              />
              <Tooltip content={<CustomTooltip />} />
              {visibility.Battery.showVoltage && (
                <Line
                  type="monotone"
                  dataKey="BatteryVoltage"
                  stroke={tooltipProps.BatteryVoltage.color}
                  dot={false}
                />
              )}
              {visibility.Battery.showVoltage2 &&checkLocation===true&& (
                <Line
                  type="monotone"
                  dataKey="BatteryVoltage2"
                  stroke={tooltipProps.BatteryVoltage2.color}
                  dot={false}
                />
              )}
              {visibility.Battery.showVoltage3 && checkLocation===true&&(
                <Line
                  type="monotone"
                  dataKey="BatteryVoltage3"
                  stroke={tooltipProps.BatteryVoltage3.color}
                  dot={false}
                />
              )}
              {visibility.Battery.showVoltage4 && checkLocation===true&& (
                <Line
                  type="monotone"
                  dataKey="BatteryVoltage4"
                  stroke={tooltipProps.BatteryVoltage4.color}
                  dot={false}
                />
              )}
              <Brush dataKey="ccAxisXValue" height={30} stroke="#007BFF" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div
            className="absolute inset-0 bg-gray-800 opacity-75"
            onClick={() => handleModalToggle(null)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-3/4">
            <div className="flex justify-between items-center p-2 gap-2 bg-gray-100 border border-b-gray-300 text-black rounded-t-lg">
              <h3 className="md:text-lg text-sm text-black font-bold">{activeModal} Readings</h3>
              <div className="flex gap-2">
                {parameters.map((param) => {
                  const dataKey = categories[activeModal][param.index];
                  const color = tooltipProps[dataKey].color;
                  
                  return (
                    <button
                      key={param.key}
                      onClick={() => handleCheckboxChange(
                        activeModal, 
                        param.key, 
                        !visibility[activeModal][param.key]
                      )}
                      style={{
                        backgroundColor: visibility[activeModal][param.key] ? color : 'transparent',
                        border: `2px solid ${color}`,
                        color: visibility[activeModal][param.key] ? 'white' : color,
                      }}
                      className="md:px-2 px-1 py-1 rounded-full md:text-[12px] text-[10px] font-small transition-colors"
                    >
                      {param.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handleModalToggle(null)}
                className="text-gray-600 bg-white rounded-lg border border-gray hover:text-gray-800 p-2 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="pr-2 bg-white shadow rounded-lg overflow-x-auto">
              <div className="p-0 bg-white shadow rounded-lg w-full h-[250px] sm:h-[200px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={graphValues}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    className="bg-gray-50"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="ccAxisXValue"
                      tickFormatter={formatTick}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      domain={calculateYDomain(activeModal, categories[activeModal])}
                      tickCount={10}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat().format(Math.round(value))
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {visibility[activeModal]?.showVoltage && (
                      <Line
                        type="monotone"
                        dataKey={categories[activeModal][0]}
                        stroke={tooltipProps[categories[activeModal][0]].color}
                        dot={false}
                        className="transition duration-300 hover:opacity-80"
                      />
                    )}
                    {visibility[activeModal]?.showVoltage2 && (
                      <Line
                        type="monotone"
                        dataKey={categories[activeModal][1]}
                        stroke={tooltipProps[categories[activeModal][1]].color}
                        dot={false}
                        className="transition duration-300 hover:opacity-80"
                      />
                    )}
                    {visibility[activeModal]?.showVoltage3 && (
                      <Line
                        type="monotone"
                        dataKey={categories[activeModal][2]}
                        stroke={tooltipProps[categories[activeModal][2]].color}
                        dot={false}
                        className="transition duration-300 hover:opacity-80"
                      />
                    )}
                    {visibility[activeModal]?.showVoltage4 && (
                      <Line
                        type="monotone"
                        dataKey={categories[activeModal][3]}
                        stroke={tooltipProps[categories[activeModal][3]].color}
                        dot={false}
                        className="transition duration-300 hover:opacity-80"
                      />
                    )}
                    <Brush dataKey="ccAxisXValue" height={30} stroke="#007BFF" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatteryGraph;