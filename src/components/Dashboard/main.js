import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { format, addDays } from "date-fns";
import axios from "axios"
import Spinner from "../Loader/loader";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";


const App = () => {

  const [working, setworking] = useState([]);
  const [notworking, setnotworking] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('working');
  const [devices, setDevices] = useState({ workingDevices: [], notWorkingDevices: [] });
  const [allDevices, setAllDevices] = useState([]);
  const [date, setDate] =useState(new Date().toISOString().split("T")[0]);

  const handleDateChange = (newdate) => {
    if (newdate !== date) 
      setDate(newdate);
  };
  const handleNavigation = (direction) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + (direction === "forward" ? 1 : -1));
    setDate(currentDate.toISOString().split("T")[0]);
  };

  const refreshDate = () => {
    setDate(new Date());
  };


  const fetchDevices = useCallback(async () => {

    setIsLoading(true);
    setError(null);
  

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST}/admin/generation`,
        { date }
      );
      

      if (response.status === 200) {
        const { data } = response.data;

        
        if (data.workingDevices && data.notWorkingDevices) {
        
          setDevices({
            workingDevices: data.workingDevices,
            notWorkingDevices: data.notWorkingDevices,
          });
          setAllDevices([]); 
        } else {
          // Detailed report for other dates
          setDevices({ workingDevices: [], notWorkingDevices: [] });
          setAllDevices(data.map((device) => ({
            ...device,
            status: device.batteryvol !== 0 ? "Worked" : "Not Worked",
          })));
        }
      }
    } catch (err) {
      setError("Error fetching devices. Please try again.");
    } finally {
      setIsLoading(false);
     
    }
  }, [date]);

  useEffect(() => {
    fetchDevices();
  }, [date, fetchDevices]);


  const DeviceStatus = ({workingLocations,notWorkingLocations }) => {
   

 
    // Compute maximum solar generation among active locations for progress bar calculation
    const maxGeneration =
      workingLocations.length > 0
        ? Math.max(...workingLocations.map(loc => loc.p1ValueTot))
        : 1;
  
    return (
      <div className="p-4 w-full mx-auto text-gray-900">
        {/* Header with Date Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="md:text-2xl text-xl font-bold mb-4 md:mb-0">
            Solar Generation Dashboard
          </h2>
          <div className="flex flex-row justify-center md:ml-auto items-center gap-2 p-4 py-2 border rounded-full shadow-md bg-gray-100">
            <button
              onClick={() => handleNavigation("backward")}
              className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="p-2 border rounded-lg bg-white"
            />
            <button
              onClick={() => handleNavigation("forward")}
              className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={refreshDate}
              className="bg-green-500 p-2 rounded-full hover:bg-green-600 text-white"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
  
        {/* Mobile Tabs */}
        <div className="md:hidden flex justify-between  mb-6">
          <button
            className={`md:px-6 md:py-3 px-4 py-2 rounded-full text-lg font-semibold transition-all shadow-md flex items-center gap-2 ${
              activeTab === 'working'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => setActiveTab('working')}
          >
            <CheckCircleIcon className="w-6 h-6" /> Active
            <span className="inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-gray-500 bg-white/50 rounded-full">
                  {workingLocations.length}
                </span>
          </button>
          <button
            className={`md:px-6 md:py-3 px-4 py-2 rounded-full text-lg font-semibold transition-all shadow-md flex items-center gap-2 ${
              activeTab === 'notWorking'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => setActiveTab('notWorking')}
          >
            <XCircleIcon className="w-6 h-6" /> Inactive
            <span className="inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-gray-500 bg-white/50 rounded-full">
                  {notWorkingLocations.length}
                </span>
          </button>
        </div>
  
        {/* Desktop Layout */}
        <div className="hidden md:flex md:space-x-8 md:mb-8">
          {/* Active Locations */}
          <div className="flex flex-col space-y-6 md:w-1/2 bg-white p-6 rounded-lg shadow-xl border-l-8 border-green-500">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-bold text-green-600 flex items-center gap-2">
                <CheckCircleIcon className="w-8 h-8" /> Active 
              </h3>
              {/* Badge showing number of active locations */}
              <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-bold leading-none text-white bg-blue-600 rounded-full">
                {workingLocations.length}
              </span>
            </div>
            <ul className="list-none space-y-4">
              {workingLocations.length > 0 ? (
                workingLocations.map((location, index) => {
                  const sites = ["Perumugai", "Agalur", "Alagarai"];
                                    
                  const siteName = location.key?.split("-")[1]?.trim(); // Safely get and trim the site name
                  console.log("Extracted Site Name:", siteName); // Debugging log

                  const progress = 
                    (location.p1ValueTot / (siteName && sites.includes(siteName) ? location.p1ValueTot : 4)) * 100;


                  return (
                    <li
                      key={index}
                      className="text-lg bg-green-100 p-4 rounded-xl shadow-md font-medium"
                    >
                      <div className="flex justify-between items-center">
                        <span>{location.key}</span>
                     <div>
                     <span className="text-green-700 font-bold">
                          {location.p1ValueTot} kW
                        </span> 
                        <span className="text-green-700 font-bold">
                         /  4 kW
                        </span>
                     </div>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-center text-gray-500">
                  No active locations found.
                </li>
              )}
            </ul>
          </div>
  
          {/* Inactive Locations */}
          <div className="flex flex-col space-y-6 md:w-1/2 bg-white p-6 rounded-lg shadow-xl border-l-8 border-red-500">
            <div className="flex items-center gap-4">
              <h3 className="text-3xl font-bold text-red-600 flex items-center gap-2">
                <XCircleIcon className="w-8 h-8" /> Inactive 
              </h3>
              {/* Badge showing number of inactive locations */}
              <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-bold leading-none text-white bg-blue-600 rounded-full">
                {notWorkingLocations.length}
              </span>
            </div>
            <ul className="list-none space-y-4">
              {notWorkingLocations.length > 0 ? (
                notWorkingLocations.map((location, index) => (
                  <li
                    key={index}
                    className="text-lg bg-red-100 p-4 rounded-xl shadow-md font-medium flex justify-between"
                  >
                    <span>{location.key}</span>
                    <span className="text-red-700 font-bold">
                      {location.p1ValueTot} kW
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500">
                  No inactive locations found.
                </li>
              )}
            </ul>
          </div>
        </div>
  
        {/* Mobile View */}
        <div className="md:hidden">
          {activeTab === 'working' ? (
            <div className="bg-white p-6 pt-6 rounded-lg shadow-xl border-l-8 border-green-500">
              
              <ul className="list-none space-y-4">
                {workingLocations.length > 0 ? (
                  workingLocations.map((location, index) => {
                    const sites = ["Perumugai", "Agalur", "Alagarai"];
                                    
                  const siteName = location.key?.split("-")[1]?.trim(); // Safely get and trim the site name
                  console.log("Extracted Site Name:", siteName); // Debugging log

                  const progress = 
                    (location.p1ValueTot / (siteName && sites.includes(siteName) ? location.p1ValueTot : 4)) * 100;


                    return (
                      <li
                        key={index}
                        className="text-lg bg-green-100 p-3 rounded-lg shadow-md font-medium"
                      >
                        <div className="flex flex-row justify-between items-center ">
  <span
    style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}
    className="font-bold break-words "
  >
    {location.key}
  </span>
  <span
    style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}
    className="text-green-700 font-bold"
  >
    {location.p1ValueTot} kW
  </span>
</div>

                        <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-center text-gray-500">
                    No active locations found.
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="bg-white p-6 pt-6  rounded-lg shadow-xl border-l-8 border-red-500">
             
              <ul className="list-none space-y-4">
                {notWorkingLocations.length > 0 ? (
                  notWorkingLocations.map((location, index) => (
                    <li
                      key={index}
                      className="text-lg bg-red-100 p-3 rounded-lg shadow-md font-medium"
                    >
                                          <div className="flex flex-row justify-between items-center ">
  <span
    style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}
    className="font-bold break-words "
  >
    {location.key}
  </span>
  <span
    style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}
    className="text-red-700 font-bold"
  >
    {location.p1ValueTot} kW
  </span>
</div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500">
                    No inactive locations found.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  


  return (
    <div className="bg-sky-100 min-h-screen flex items-start overflow-y-auto justify-center mb-20 md:mb-0">
        {isLoading ? (
        <Spinner />
      ) :  date > new Date().toISOString().split("T")[0]? (
        <div className="flex justify-center items-center">
          <img className="w-1/2"  alt="Error" />
          <p>{error}</p>
        </div>
      ) : date === new Date().toISOString().split("T")[0] ? (
        <div className="w-full">
          <DeviceStatus title="Working Devices" workingLocations={devices.workingDevices} notWorkingLocations={devices.notWorkingDevices} />
         
        </div>
      ) : (
        <div className="w-full flex flex-justify-center">
          <DeviceStatus title="Worked Devices" devices={allDevices.filter(d => d.status === "Worked")}  workingLocations={allDevices.filter(d => d.status === "Worked")} notWorkingLocations={allDevices.filter(d => d.status === "Not Worked")} />
         
        </div>
      )}
    </div>
  );
};

export default App;
