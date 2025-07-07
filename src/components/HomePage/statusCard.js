import { useRef } from "react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import WeatherInfo from './whether';
import { format, addDays } from "date-fns";
import { Calendar, Download, CircleAlert,  MapPin, CheckCircle } from "lucide-react";
import axios from "axios"
import { useSelector } from 'react-redux';

export default function StatusCard({device, alert,type, capacity,  lastupdate, updatedEngergies}) {
 
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
    <div className="h-full mb-4 mx-4 md:mx-0 bg-white px-2 md:px-8 shadow-md p-2 rounded-xl md:rounded-3xl flex flex-row md:flex-row-2 items-center justify-between gap-4 md:gap-2">
      <div className="text-center  md:w-auto md:text-left flex flex-col justify-center md:justify-center gap-2 md:gap-4 ">
      <div className="flex   flex-col md:flex-row items-start gap-2 md:gap-4">
<div>
      <div className=" inline-flex flex-row justify-center items-center gap-1 md:gap-2 bg-white px-3 w-full md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base  border border-gray-300 max-w-full">
  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
  <span className="font-sm text-gray-700 text-md  sm:text-sm md:text-md lg:text-xl md:font-bold font-bold  truncate">
    {device}  
   
   
  </span>
  
 

</div>
 <div className="text-md text-gray-800 mt-2 border text-center font-bold border-gray-300 rounded-full px-3 md:px-1 py-2 md:py-3">
  Solar PV Capacity:{capacity} kWp
</div>
</div>


    <WeatherInfo lat={devicelocation.geocode[0]} lon={devicelocation.geocode[1]} />

      </div>
{alert !== "success" ? (
  <button className="flex flex-row items-center w-full md:w-[50%] m-r-auto justify-center gap-1 md:gap-2 bg-red-500 text-white px-2 md:px-2 py-1.5 md:py-2 rounded-full text-sm md:text-base shadow-md">
    <CircleAlert  className="w-4 h-4 md:w-5 md:h-5" /> Offline
  </button>
) : (
  <button className="flex flex-row items-center w-full md:w-[50%]  m-r-auto  justify-center gap-1 md:gap-2 bg-green-500 text-white px-2 md:px-2 py-1.5 md:py-2 rounded-full text-sm md:text-base shadow-md">
    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Online
  </button>
)}





       







      </div>

      <div className="flex flex-col justify-center w-[55%] md:justify-center gap-2 md:gap-4  md:w-auto">


        <div className="flex w-[100%] flex-row  item-center justify-center md:justify-end gap-2 md:gap-4">
        
        <div className="relative  w-full sm:w-auto flex flex-row items-center justify-center">
      {/* Hidden Date Input for Mobile, Visible on Larger Screens */}
      <input 
        type="date" 
        ref={dateInputRef}
         value={format(date, "yyyy-MM-dd")}
        onChange={(e) => setDate(e.target.value)}
        className="w-0 opacity-0 sm:w-auto sm:opacity-100 bg-white border border-gray-500 outline-none text-gray-700 text-sm sm:text-base p-3 sm:p-2 rounded-full cursor-pointer transition-all duration-300 appearance-none"
      />
      {/* Clickable Calendar Icon for Mobile */}
     <div className="p-3 border border-gray-300 item-end mr-2 ml-auto  rounded-full sm:hidden"> <Calendar 
      size={20}
        className=" inset-y-0 left-3 flex items-center text-gray-600   cursor-pointer sm:hidden"
        onClick={handleIconClick} 
      /></div>
    </div>



          <button
           onClick={handlePrint} 
           className="flex items-center gap-1 md:gap-2 py-2 px-3 bg-white  md:px-5  md:py-2 rounded-full text-sm md:text-base  hover:bg-gray-200 transition-all duration-300 border border-gray-500">
            <Download className=" md:w-5 md:h-4" size={20} /> 
            <span className="hidden md:block">Download</span>
          </button>
        </div>
        <p className=" md:w-full text-center ml-auto  md:text-xl text-sm font-semibold md:text-sm text-gray-800">
          Last Update: <br className="md:hidden"/> 
          <span className="font-bold md:font-semibold text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg">
            {lasttime.toLocaleString()}
          </span>
        </p>
     
      </div>
    </div>
  );
}
