import React, { useState, useCallback } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Brush,
    ResponsiveContainer,
} from "recharts";
import { Download, Maximize2  } from 'lucide-react'

import { FiMaximize, FiX } from "react-icons/fi";

// Tooltip properties (custom colors for keys)
const tooltipProps = {
    "SolarVoltage": { color: "blue" },
    "SolarCurrent": { color: "green" },
    "SolarPower": { color: "red" },
    "InverterVoltage": { color: "blue" },
    "InverterCurrent": { color: "green" },
    "InverterPower":  { color: "red" },
    "GridVoltage": { color: "blue" },
    "GridCurrent": { color: "green" },
    "GridPower":  { color: "red"  },
    "BatteryVoltage": { color: "blue" },
    "BatteryCurrent":{ color: "green" },
    "BatteryPower": { color: "red"},
};

// Format X-axis ticks
const formatTick = (tick) => {
    const [hourStr, minuteStr] = tick.split(":");
    let hour = parseInt(hourStr, 10);
    let minute = parseInt(minuteStr, 10);
    minute = minute < 10 ? `0${minute}` : minuteStr;
    hour = hour < 10 ? `0${hour}` : hour;
    return hour === 24 ? `00:${minute}` : `${hour}:${minute}`;
};

// Map keys to their respective units
const units = {
    SolarVoltage: "V",
    SolarCurrent: "A",
    SolarPower: "W",
    InverterVoltage: "V",
    InverterCurrent: "A",
    InverterPower: "W",
    GridVoltage: "V",
    GridCurrent: "A",
    GridPower: "W",
    BatteryVoltage: "V",
    BatteryCurrent: "A",
    BatteryPower: "W",
};

// Custom Tooltip with units
const CustomTooltip = ({ active, payload, label }) => {
  
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-300 p-2 rounded-md shadow-sm">
                <p className="font-semibold">{`Time: ${label}`}</p>
                {payload.map((item, index) => (
                    <p key={index} style={{ color: item.color }}>
                        {`${item.name}: ${item.value} ${units[item.name] || ""}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


const Graph = () => {

const dataCharts= [ {
    "ccAxisXValue": "10:44",
    "SolarVoltage": 31.84439,
    "SolarCurrent": "4.96",
    "SolarPower": 157,
    "InverterVoltage": 195.85417,
    "InverterCurrent": "0.95",
    "InverterPower": 186,
    "GridVoltage": 204.48053,
    "GridCurrent": "0.00",
    "GridPower": 0,
    "BatteryVoltage": 24.11045,
    "BatteryCurrent": "NaN",
    "BatteryPower": null,
    "InletTemperature": null,
    "OutletTemperature": null
},
{
    "ccAxisXValue": "10:45",
    "SolarVoltage": 33.13006,
    "SolarCurrent": "8.14",
    "SolarPower": 269,
    "InverterVoltage": 198.8432,
    "InverterCurrent": "1.02",
    "InverterPower": 203,
    "GridVoltage": 203.8241,
    "GridCurrent": "0.00",
    "GridPower": 0,
    "BatteryVoltage": 24.79883,
    "BatteryCurrent": "NaN",
    "BatteryPower": null,
    "InletTemperature": null,
    "OutletTemperature": null
},
{
    "ccAxisXValue": "10:46",
    "SolarVoltage": 33.27247,
    "SolarCurrent": "9.72",
    "SolarPower": 323,
    "InverterVoltage": 198.77545,
    "InverterCurrent": "1.05",
    "InverterPower": 209,
    "GridVoltage": 203.3614,
    "GridCurrent": "0.00",
    "GridPower": 0,
    "BatteryVoltage": 26.47894,
    "BatteryCurrent": "NaN",
    "BatteryPower": null,
    "InletTemperature": null,
    "OutletTemperature": null
},
{
    "ccAxisXValue": "10:47",
    "SolarVoltage": 33.26162,
    "SolarCurrent": "9.95",
    "SolarPower": 330,
    "InverterVoltage": 196.99307,
    "InverterCurrent": "1.06",
    "InverterPower": 209,
    "GridVoltage": 203.35263,
    "GridCurrent": "0.00",
    "GridPower": 0,
    "BatteryVoltage": 27.59169,
    "BatteryCurrent": "NaN",
    "BatteryPower": null,
    "InletTemperature": null,
    "OutletTemperature": null
},
{
    "ccAxisXValue": "10:48",
    "SolarVoltage": 31.6592,
    "SolarCurrent": "6.53",
    "SolarPower": 206,
    "InverterVoltage": 195.74303,
    "InverterCurrent": "0.90",
    "InverterPower": 175,
    "GridVoltage": 202.99007,
    "GridCurrent": "0.00",
    "GridPower": 0,
    "BatteryVoltage": 25.83811,
    "BatteryCurrent": "NaN",
    "BatteryPower": null,
    "InletTemperature": null,
    "OutletTemperature": null
},
{
    "ccAxisXValue": "10:49",
    "SolarVoltage": 31.76205,
    "SolarCurrent": "5.96",
    "SolarPower": 189,
    "InverterVoltage": 198.2829,
    "InverterCurrent": "0.92",
    "InverterPower": 183,
    "GridVoltage": 203.11206,
    "GridCurrent": "0.00",
    "GridPower": 0,
    "BatteryVoltage": 25.87055,
    "BatteryCurrent": "NaN",
    "BatteryPower": null,
    "InletTemperature": null,
    "OutletTemperature": null
},
{
    "ccAxisXValue": "10:50",
    "SolarVoltage": 31.55042,
    "SolarCurrent": "5.70",
    "SolarPower": 179,
    "InverterVoltage": 195.27432,
    "InverterCurrent": "0.91",
    "InverterPower": 177,
    "GridVoltage": 203.97591,
    "GridCurrent": "0.00",
    "GridPower": 0,
    "BatteryVoltage": 25.32512,
    "BatteryCurrent": "NaN",
    "BatteryPower": null,
    "InletTemperature": null,
    "OutletTemperature": null
},]
    const [activeModal, setActiveModal] = useState(null);
    const [visibility, setVisibility] = useState({
        Solar: { showVoltage: true, showCurrent: true, showPower: true },
        Inverter: { showVoltage: true, showCurrent: true, showPower: true },
        Grid: { showVoltage: true, showCurrent: true, showPower: true },
        Battery: { showVoltage: true, showCurrent: true, showPower: true },
    });

    const handleCheckboxChange = useCallback((category, key, checked) => {
        setVisibility((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: checked,
            },
        }));
    }, []);

    const handleModalToggle = useCallback((category) => {
        setActiveModal((prev) => (prev === category ? null : category));
    }, []);

    const categories = {
        Solar: ["SolarVoltage", "SolarCurrent", "SolarPower"],
        Inverter: ["InverterVoltage", "InverterCurrent", "InverterPower"],
        Grid: ["GridVoltage", "GridCurrent", "GridPower"],
        Battery: ["BatteryVoltage", "BatteryCurrent", "BatteryPower"],
      
    };

    // Calculate Y-axis domain dynamically based on active toggles
    const calculateYDomain = (category, keys) => {
        const activeKeys = keys.filter((key, index) => {
            if (index === 0) return visibility[category]?.showVoltage;
            if (index === 1) return visibility[category]?.showCurrent;
            if (index === 2) return visibility[category]?.showPower;
            return false;
        });

        if (activeKeys.length === 0) {
            return [0, 100]; // Default range when nothing is selected
        }

        const values = dataCharts.flatMap((data) =>
            activeKeys.map((key) => data[key] || 0)
        );

        const min = Math.min(...values);
        const max = Math.max(...values);
       

        return [ 0, max + 20]; // Add buffer for better visualization
    };

    return (
        <div className="flex flex-wrap justify-around w-full">
  {Object.entries(categories).map(([category, keys]) => {
    const yDomain = calculateYDomain(category, keys);
    const { showVoltage, showCurrent, showPower } = visibility[category];

    return (
      <div
        key={category}
        className="bg-white shadow-lg rounded-3xl border w-full sm:w-[45%] border-gray-200 overflow-hidden mb-6"
      >
        <div className="p-4 bg-gray-50 border border-b-gray-300 flex flex-col sm:flex-row justify-between items-center text-black rounded-t-lg">
          <h3 className="text-lg font-extrabold mb-2 sm:mb-0">
            {category} Readings
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="relative inline-block h-6 w-10 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300">
                <input
                  className="peer sr-only"
                  id={`voltage-${category}`}
                  type="checkbox"
                  checked={showVoltage}
                  onChange={(e) =>
                    handleCheckboxChange(category, "showVoltage", e.target.checked)
                  }
                />
                <span
                  className="absolute inset-y-0 left-0 m-1 block h-4 w-4 rounded-full bg-gray-300 ring-[36px] ring-inset ring-white transition-all peer-checked:translate-x-4 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
              <span className="text-sm">Voltage</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative inline-block h-6 w-10 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300">
                <input
                  className="peer sr-only"
                  id={`current-${category}`}
                  type="checkbox"
                  checked={showCurrent}
                  onChange={(e) =>
                    handleCheckboxChange(category, "showCurrent", e.target.checked)
                  }
                />
                <span
                  className="absolute inset-y-0 left-0 m-1 block h-4 w-4 rounded-full bg-gray-300 ring-[36px] ring-inset ring-white transition-all peer-checked:translate-x-4 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
              <span className="text-sm">Current</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="relative inline-block h-6 w-10 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300">
                <input
                  className="peer sr-only"
                  id={`power-${category}`}
                  type="checkbox"
                  checked={showPower}
                  onChange={(e) =>
                    handleCheckboxChange(category, "showPower", e.target.checked)
                  }
                />
                <span
                  className="absolute inset-y-0 left-0 m-1 block h-4 w-4 rounded-full bg-gray-300 ring-[36px] ring-inset ring-white transition-all peer-checked:translate-x-4 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
              <span className="text-sm">Power</span>
            </div>
          </div>

          <button
            onClick={() => handleModalToggle(category)}
            className="text-gray-600 bg-white rounded-lg border border-gray hover:text-gray-800 p-2 hover:bg-gray-100 mt-2 sm:mt-0"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 pb-10">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={dataCharts}
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="ccAxisXValue" tickFormatter={formatTick} />
              <YAxis
                domain={yDomain}
                tickCount={10}
                ticks={
                  category === "Battery"
                    ? [0, 15, 25, 35, 45, 50]
                    : undefined
                }
                tickFormatter={(value) =>
                  new Intl.NumberFormat().format(Math.round(value))
                }
              />
              <Tooltip content={<CustomTooltip />} />
              {showVoltage && (
                <Line
                  type="monotone"
                  dataKey={keys[0]}
                  stroke={tooltipProps[keys[0]].color}
                  dot={false}
                />
              )}
              {showCurrent && (
                <Line
                  type="monotone"
                  dataKey={keys[1]}
                  stroke={tooltipProps[keys[1]].color}
                  dot={false}
                />
              )}
              {showPower && (
                <Line
                  type="monotone"
                  dataKey={keys[2]}
                  stroke={tooltipProps[keys[2]].color}
                  dot={false}
                />
              )}
              <Brush dataKey="ccAxisXValue" height={30} stroke="#007BFF" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  })}

  {/* Modal View */}
  {activeModal && (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-gray-800 opacity-75"
        onClick={() => handleModalToggle(null)}
      ></div>
      
      <div className="relative bg-white rounded-3xl shadow-xl w-full md:w-3/4">
        <div className="p-5 bg-gray-100 border border-b-gray-300 rounded-t-3xl flex flex-row sm:flex-row justify-between items-start md:items-center">
        
        
         <div className="flex md:flex-row flex-col item-center justify-evenly w-[80%] md:w-[60%]">

         <h3 className="text-xl font-bold text-black mb-2 sm:mb-0">
            {activeModal} Readings
          </h3>
          <div className="flex flex-row justify-center items-center gap-6">
            
            <div className="flex flex-col items-center gap-2">
              <label className="relative inline-block h-6 w-10 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={visibility[activeModal]?.showVoltage}
                  onChange={(e) =>
                    handleCheckboxChange(activeModal, "showVoltage", e.target.checked)
                  }
                />
                <span
                  className="absolute inset-y-0 left-0 m-1 block h-4 w-4 rounded-full bg-gray-300 ring-[36px] ring-inset ring-white transition-all peer-checked:translate-x-4 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
              <span className="text-sm">Voltage</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <label className="relative inline-block h-6 w-10 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={visibility[activeModal]?.showCurrent}
                  onChange={(e) =>
                    handleCheckboxChange(activeModal, "showCurrent", e.target.checked)
                  }
                />
                <span
                  className="absolute inset-y-0 left-0 m-1 block h-4 w-4 rounded-full bg-gray-300 ring-[36px] ring-inset ring-white transition-all peer-checked:translate-x-4 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
              <span className="text-sm">Current</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <label className="relative inline-block h-6 w-10 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={visibility[activeModal]?.showPower}
                  onChange={(e) =>
                    handleCheckboxChange(activeModal, "showPower", e.target.checked)
                  }
                />
                <span
                  className="absolute inset-y-0 left-0 m-1 block h-4 w-4 rounded-full bg-gray-300 ring-[36px] ring-inset ring-white transition-all peer-checked:translate-x-4 peer-checked:bg-white peer-checked:ring-transparent"
                ></span>
              </label>
              <span className="text-sm">Power</span>
            </div>
          </div>


         </div>


          <button
            onClick={() => handleModalToggle(null)}
            className="text-gray-600 bg-white rounded-lg border border-gray hover:text-gray-800 p-2 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>
        <div  className="pr-2 bg-white shadow rounded-lg overflow-x-auto">
           <div className="p-0 bg-white shadow rounded-lg  w-full h-[250px] sm:h-[200px] md:h-[400px]">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={dataCharts}
      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
      className="bg-gray-50"  // adds a subtle background to the SVG container
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis
        dataKey="ccAxisXValue"
        tickFormatter={formatTick}
        // Note: Although XAxis renders text as SVG, you can still adjust its look via its props or via global SVG styling.
      />
      <YAxis
        domain={calculateYDomain(activeModal, categories[activeModal])}
        tickCount={10}
        tickFormatter={(value) =>
          new Intl.NumberFormat().format(Math.round(value))
        }
      />
      <Tooltip
        content={<CustomTooltip />}
        // Use wrapperClassName to apply Tailwind styling to the tooltip container
        wrapperClassName="bg-gray-800 text-white p-2 rounded-md shadow-md"
      />
      {visibility[activeModal]?.showVoltage && (
        <Line
          type="monotone"
          dataKey={categories[activeModal][0]}
          stroke={tooltipProps[categories[activeModal][0]].color}
          dot={false}
          className="transition duration-300 hover:opacity-80"  // add subtle transition on hover
        />
      )}
      {visibility[activeModal]?.showCurrent && (
        <Line
          type="monotone"
          dataKey={categories[activeModal][1]}
          stroke={tooltipProps[categories[activeModal][1]].color}
          dot={false}
          className="transition duration-300 hover:opacity-80"
        />
      )}
      {visibility[activeModal]?.showPower && (
        <Line
          type="monotone"
          dataKey={categories[activeModal][2]}
          stroke={tooltipProps[categories[activeModal][2]].color}
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
</div>

    );
};

export default Graph;