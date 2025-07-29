
import { useRef } from "react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

import { format, addDays } from "date-fns";

import axios from "axios"
import { useSelector } from 'react-redux';
import panels from "../images/panels.jpg";
import WeatherInfo from "./whether.js";
import {
  CalendarDays,
  Download,
  Thermometer,
  Power,
  CheckCircle,
} from "lucide-react";

const CoolingSystemCard = ({device, alert,type, capacity,  lastupdate, updatedEngergies}) => {
 const devicelocation = useSelector((state) => state.location.device);
  
  const [date, setDate]=useState(new Date());
  const lasttime = new Date(lastupdate * 1000);
  
  const dateInputRef = useRef(null);
  const timeDelta=devicelocation.timeInterval

  const handleIconClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker(); // Opens the native date picker
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { newDataArray } = await dataFetch();
        
      if (newDataArray.length === 0) {
        console.warn("No data fetched");
        return;
      }

      let solarGeneration = 0;
      let gridEnergy = 0;
      let loadConsumption = 0;
      
      newDataArray.forEach((item) => {
        const solarCurrent = parseFloat(item.solarCurrent) || 0;
        const gridCurrent = parseFloat(item.gridCurrent) || 0;
        const inverterCurrent = parseFloat(item.inverterCurrent) || 0;
        
        const solarVoltage = parseFloat(item.solarVoltage) || 0;
        const gridVoltage = parseFloat(item.gridVoltage) || 0;
        const inverterVoltage = parseFloat(item.inverterVoltage) || 0;
        
        solarGeneration += (solarCurrent * solarVoltage) * timeDelta * 60 / (1000 * 3600);
        gridEnergy += (gridCurrent * gridVoltage) * timeDelta * 60 / (1000 * 3600);
        loadConsumption += (inverterCurrent * inverterVoltage) * timeDelta * 60 / (1000 * 3600);
      });
      
      updatedEngergies(solarGeneration, gridEnergy, loadConsumption);


      
     
    };

    fetchData();
  }, [date]);

  const dataFetch = async () => {
    try {
      const token = Cookies.get("token");
     
      const datas = await axios.post(
        `${process.env.REACT_APP_HOST}/admin/date`,
        { selectedItem: devicelocation.path||"", date: format(date, "yyyy-MM-dd") },
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (datas.status === 200) {
     
       console.log(datas.data.data.dataCharts)
          
        const newDataArray = datas.data.data.dataCharts.map((chart) => ({
             
          time: chart.ccAxisXValue,
          solarVoltage: `${chart.SolarVoltage}`,
          solarCurrent: `${chart.SolarCurrent}`,
          inverterVoltage: `${chart.InverterVoltage}`,
          inverterCurrent: `${chart.InverterCurrent}`,
          gridVoltage: `${chart.GridVoltage}`,
          gridCurrent: `${chart.GridCurrent}`,
          batteryCurrent: `${chart.BatteryCurrent}`,
          batteryVoltage: `${chart.BatteryVoltage}`,
          batteryVoltage1: `${chart.BatteryVoltage1}`,
          batteryVoltage2: `${chart.BatteryVoltage2}`,
          batteryVoltage3: `${chart.BatteryVoltage3}`,
          batteryVoltage4: `${chart.BatteryVoltage4}`,

        
        }));

        
        return {newDataArray}
        
       
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };


  const handlePrint = async (e) => {
    e.preventDefault();
    
    try {
      const { newDataArray } = await dataFetch();
      
      if (newDataArray.length === 0) {
        console.warn("No data fetched");
        return;
      }
      
      console.log({ newDataArray });
      
      
      // Transform the data for Excel
      const data = newDataArray.map((item) => ({
        Time: item.time,
        "Solar Voltage": parseFloat(item.solarVoltage) || 0,
        "SV Unit": "V",
        "Solar Current": parseFloat(item.solarCurrent) || 0,
        "SC Unit": "A",
        "Inverter Voltage": parseFloat(item.inverterVoltage) || 0,
        "IV Unit": "V",
        "Inverter Current": parseFloat(item.inverterCurrent) || 0,
        "IC Unit": "A",
        "Grid Voltage": parseFloat(item.gridVoltage) || 0,
        "GV Unit": "V",
        "Grid Current": parseFloat(item.gridCurrent) || 0,
        "GC Unit": "A",
      
        "Battery Current": parseFloat(item.batteryCurrent) || 0,
        "BC Unit": "A",
        "Battery Voltage 1": parseFloat(item.batteryVoltage) || 0,
        "BV1 Unit": "V",
        "Battery Voltage 2": parseFloat(item.batteryVoltage2) || 0,
        "BV2 Unit": "V",
        "Battery Voltage 3": parseFloat(item.batteryVoltage3) || 0,
        "BV3 Unit": "V",
        "Battery Voltage 4": parseFloat(item.batteryVoltage4) || 0,
        "BV4 Unit": "V",
      }));
      
      // Calculate energy values
      let solarGeneration = 0;
      let gridEnergy = 0;
      let loadConsumption = 0;
      
      newDataArray.forEach((item) => {
        const solarCurrent = parseFloat(item.solarCurrent) || 0;
        const gridCurrent = parseFloat(item.gridCurrent) || 0;
        const inverterCurrent = parseFloat(item.inverterCurrent) || 0;
        
        const solarVoltage = parseFloat(item.solarVoltage) || 0;
        const gridVoltage = parseFloat(item.gridVoltage) || 0;
        const inverterVoltage = parseFloat(item.inverterVoltage) || 0;
        
        solarGeneration += (solarCurrent * solarVoltage) * timeDelta * 60 / (1000 * 3600);
        gridEnergy += (gridCurrent * gridVoltage) * timeDelta * 60 / (1000 * 3600);
        loadConsumption += (inverterCurrent * inverterVoltage) * timeDelta * 60 / (1000 * 3600);
      });
      
      // Add summary row
      data.push({}); // Empty row for spacing
      data.push({
        Time: "End of Day Summary",
        "Solar Voltage": "Solar Generation:",
        "SV Unit": `${solarGeneration.toFixed(2)} kWh`,
        "Solar Current": "",
        "SC Unit": "",
        "Inverter Voltage": "Grid Energy:",
        "IV Unit": `${gridEnergy.toFixed(2)} kWh`,
        "Inverter Current": "",
        "IC Unit": "",
        "Grid Voltage": "Load Consumption:",
        "GV Unit": `${loadConsumption.toFixed(2)} kWh`,
      });
      
      // Create a new workbook and add worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 12 },  // Time
        { wch: 12 },  // Solar Voltage
        { wch: 7 },   // SV Unit
        { wch: 12 },  // Solar Current
        { wch: 7 },   // SC Unit
        { wch: 15 },  // Inverter Voltage
        { wch: 7 },   // IV Unit
        { wch: 15 },  // Inverter Current
        { wch: 7 },   // IC Unit
        { wch: 12 },  // Grid Voltage
        { wch: 7 },   // GV Unit
        { wch: 12 },  // Grid Current
        { wch: 7 },   // GC Unit
        { wch: 15 },  // Battery Voltage
        { wch: 7 },   // BV Unit
        { wch: 15 },  // Battery Current
        { wch: 7 },   // BC Unit
        { wch: 15 },  // Battery Voltage 1
        { wch: 7 },   // BV1 Unit
        { wch: 15 },  // Battery Voltage 2
        { wch: 7 },   // BV2 Unit
        { wch: 15 },  // Battery Voltage 3
        { wch: 7 },   // BV3 Unit
        { wch: 15 },  // Battery Voltage 4
        { wch: 7 },   // BV4 Unit
      ];
      ws['!cols'] = columnWidths;
      
      // Add styles to the worksheet
      // First, get the range of cells in the worksheet
      const range = XLSX.utils.decode_range(ws['!ref']);
      
      // Create styles for different cell types
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center" }
      };
      
      const dataStyle = {
        font: { color: { rgb: "000000" } },
        alignment: { horizontal: "center" }
      };
      
      const summaryStyle = {
        font: { bold: true, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "E2EFDA" } },
        alignment: { horizontal: "center" }
      };
      
      const unitStyle = {
        font: { italic: true, color: { rgb: "777777" } },
        alignment: { horizontal: "center" }
      };
      
      // Apply styles to cells
      // Note: This requires xlsx-style package to work properly
      // First, create a new worksheet with the same data
      const newWs = XLSX.utils.aoa_to_sheet(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      
      // Apply styles to header row
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!newWs[cellAddress]) continue;
        
        newWs[cellAddress].s = headerStyle;
      }
      
      // Apply styles to data rows
      for (let R = 1; R < range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!newWs[cellAddress]) continue;
          
          // Apply different styles to unit columns
          if (C % 2 === 0) { // Even-indexed columns contain values
            newWs[cellAddress].s = dataStyle;
          } else { // Odd-indexed columns contain units
            newWs[cellAddress].s = unitStyle;
          }
        }
      }
      
      // Apply special styles to summary rows (last two rows)
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress1 = XLSX.utils.encode_cell({ r: range.e.r - 1, c: C });
        const cellAddress2 = XLSX.utils.encode_cell({ r: range.e.r, c: C });
        
        if (newWs[cellAddress1]) newWs[cellAddress1].s = summaryStyle;
        if (newWs[cellAddress2]) newWs[cellAddress2].s = summaryStyle;
      }
      
      // Format numbers to have 2 decimal places
      for (let R = 1; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!newWs[cellAddress]) continue;
          
          const cell = newWs[cellAddress];
          if (typeof cell.v === 'number') {
            // Skip unit columns
            if (C % 2 === 0) {
              cell.z = '0.00'; // Format for 2 decimal places
            }
          }
        }
      }
      
      // Add the styled worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, newWs, "Energy Data");
      
      // Generate a meaningful filename with date
      const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `${devicelocation.name}-${formattedDate}.xlsx`;
      
      // Write to file
      XLSX.writeFile(wb, filename);
      
      console.log(`Excel file saved as: ${filename}`);
    } catch (error) {
      console.error("Error handling print:", error);
      // Show an error notification to the user
      alert(`Failed to generate Excel report: ${error.message}`);
    }
  };





  return (
<div className="flex flex-col sm:flex-row items-center justify-center p-4 mb-2   gap-4">

     <div className="flex flex-col sm:flex-row bg-white mr-2  border border-gray-200 overflow-hidden   w-full  sm:w-[60%]">

      {/* Image Section */}
      <img
        src={panels}
        alt="Cooling System"
        className="w-full sm:w-64 h-54 sm:h-auto object-cover"
      />

      {/* Content Section */}
      <div className="flex flex-col justify-between p-4 w-full">
        {/* System Name & Capacity */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl font-bold text-gray-800">  {device}  </h2>
           <div className="flex items-center text-gray-500 text-sm gap-2">
          <CalendarDays className="w-4 h-4" />
          <span className="font-medium text-gray-700"> Last Update : {lasttime.toLocaleString()}</span>
        </div>
        </div>

        {/* Status & Date Picker */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
            <Thermometer className="w-4 h-4" />
         Solar PV Capacity:{capacity} kWp
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto">
            <input
              type="date" 
        ref={dateInputRef}
         value={format(date, "yyyy-MM-dd")}
        onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 text-sm rounded-md px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
 onClick={handlePrint}
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-md whitespace-nowrap">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Last Updated Date */}
    {alert !== "success" ? (
  <button className="flex flex-row items-center w-full md:w-[50%] m-r-auto justify-center gap-1 md:gap-2 bg-red-500 text-white px-2 md:px-2 py-1.5 md:py-2 rounded text-sm md:text-base shadow-md">
    <CircleAlert  className="w-4 h-4 md:w-5 md:h-5" /> Offline
  </button>
) : (
  <button className="flex flex-row items-center w-full md:w-[50%]  m-r-auto  justify-center gap-1 md:gap-2 bg-green-500 text-white px-2 md:px-2 py-1.5 md:py-2 rounded text-sm md:text-base shadow-md">
    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Online
  </button>
)}
      </div>
    </div>
    <WeatherInfo/>

 </div>
  );
};

export default CoolingSystemCard;
