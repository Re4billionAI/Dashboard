import { useRef } from "react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import { format, addDays } from "date-fns";
import { Calendar, Download, MapPin, CheckCircle } from "lucide-react";
import axios from "axios"
import { useSelector } from 'react-redux';

export default function StatusCard({device, alert,  lastupdate}) {
  console.log(alert)
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
         
      const {newDataArray} = await dataFetch();
    
   
      if (newDataArray.length === 0) {
          
        console.warn("No data fetched");
        return;
      }
      
    console.log({newDataArray})
      const data = newDataArray.map((item) => ({
        Time: item.time,
        "Solar Voltage": item.solarVoltage,
        "SV Unit": "V",
        "Solar Current": item.solarCurrent,
        "SC Unit": "A",
        "Inverter Voltage": item.inverterVoltage,
        "IV Unit": "V",
        "Inverter Current": item.inverterCurrent,
        "IC Unit": "A",
        "Grid Voltage": item.gridVoltage,
        "GV Unit": "V",
        "Grid Current": item.gridCurrent,
        "GC Unit": "A",
        "Battery Voltage": item.batteryVoltage,
        "BV Unit": "V",
        "Battery Current": item.batteryCurrent,
        "BC Unit": "A",
       
      }));
    
  
      let solarGeneration = 0;
      let gridEnergy = 0;
      let loadConsumption = 0;
  
      newDataArray.forEach((item) => {
          

    
        const solarCurrent = parseFloat(item.solarCurrent) || 0;
        const gridCurrent = parseFloat(item.gridCurrent) || 0;
        const inverterCurrent = parseFloat(item.inverterCurrent) || 0;

        const solarVoltage = parseFloat(item.solarVoltage) || 0;
        const gridVoltage = parseFloat(item.gridVoltage) || 0;
        const inverterVoltage= parseFloat(item.inverterVoltage) || 0;
        
    
        solarGeneration += (solarCurrent * solarVoltage )*timeDelta*60/(1000*3600);
        gridEnergy += (gridCurrent  * gridVoltage )*timeDelta*60/(1000*3600);
        loadConsumption +=  (inverterCurrent  * inverterVoltage)*timeDelta*60/(1000*3600);
      
     
      });
  
      data.push({});
      data.push({
        Time: "End of Day",
        "Solar Voltage": "Solar Generation : ",
        "SV Unit": (solarGeneration ).toFixed(2),
        "Solar Current": "kWh",
        "SC Unit": "Grid Energy",
        "Inverter Voltage": (gridEnergy).toFixed(2),
        "IV Unit": "kWh",
        "Inverter Current": "Load Consumption",
        "IC Unit": (loadConsumption ).toFixed(2),
        "Grid Voltage": "kWh",
      });
   
      const ws = XLSX.utils.json_to_sheet(data);
   
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data Sheet");

   
      XLSX.writeFile(wb, `${devicelocation.name}-${date}.xlsx`);
    } catch (error) {
      console.error("Error handling print:", error);
    }
  };
  
  return (
    <div className="md:m- mb-4 mx-4 md:mx-0 bg-white px-2 md:px-8 shadow-md p-2 rounded-xl md:rounded-3xl flex flex-row md:flex-row-2 items-center justify-between gap-4 md:gap-2">
      <div className="text-center md:w-auto md:text-left flex flex-col justify-center md:justify-end gap-8 md:gap-10 w-[50%] ">
        <p className="text-xs font-bold md:text-sm text-gray-500">
          Last Update: <br className="md:hidden"/> 
          <span className="font-bold md:font-semibold text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg">
            {lasttime.toLocaleString()}
          </span>
        </p>
        <button className={`flex flex-row items-center w-[70%] m-auto justify-center gap-1 md:gap-2 ${alert==="success"?"bg-green-500 ":"bg-red-500" } text-white px-2 md:px-2 py-1.5 md:py-2 rounded-full text-sm md:text-base shadow-md `}>
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> {alert==="success"?"Online":"Offline"}
        </button>
      </div>
      
      <div className="flex flex-col justify-center w-[55%] md:justify-end gap-4 md:gap-4  md:w-auto">


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
     <div className="p-3 border border-gray-300  rounded-full sm:hidden"> <Calendar 
      size={20}
        className=" inset-y-0 left-3 flex items-center text-gray-600   cursor-pointer sm:hidden"
        onClick={handleIconClick} 
      /></div>
    </div>



          <button
           onClick={handlePrint} 
           className="flex items-center gap-1 md:gap-2 py-2 px-3 bg-white  md:px-5  md:py-3 rounded-full text-sm md:text-base  hover:bg-gray-200 transition-all duration-300 border border-gray-200">
            <Download className=" md:w-5 md:h-4" size={20} /> 
            <span className="hidden md:block">Download</span>
          </button>
        </div>

        <div className="ml-auto inline-flex flex-row justify-center items-center gap-1 md:gap-2 bg-white px-3 md:px-5 py-1.5 md:py-3 rounded-full text-sm md:text-base shadow-md border border-gray-200 max-w-full">
  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
  <span className="font-sm text-gray-700 text-md sm:text-sm md:text-md lg:text-md truncate">
    {device}
  </span>
</div>
      </div>
    </div>
  );
}
