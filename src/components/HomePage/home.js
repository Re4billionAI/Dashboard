import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import Spinner from "../Loader/loader"
import { ArrowLeft } from 'lucide-react';
import StatusCard from './statusCard';
import EnergyConsumption from './EnergyConsumptions';
import Graph from './graphs';
import { Menu,  } from "lucide-react";
import ParameterRepresentation from './parameter';
import { toggleSidebar } from '../Redux/CounterSlice'; 

const Home = ({ handlePageChange}) => {
  const device = useSelector((state) => state.location.device);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [alert, showAlert] = useState(null);
  const [energies, setEnergies] = useState({solargen:0, gridgen:0, loadconsumption:0});

  const fetchData = async (item, timeInterval) => {
    if (!item) return; // Prevent unnecessary API calls

    try {
      setLoading(true);
      setError(null); // Reset error state
      
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network.');
      }

      const token = Cookies.get('token');
      if (!token) throw new Error('Authentication token is missing');

      const response = await axios.post(
        `${process.env.REACT_APP_HOST}/admin/db`,
        { selectedItem: item, timeInterval: timeInterval },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.status === 200) {
       
        setLiveData(response.data);
        setEnergies({solargen:response.data.data.p1ValueTot, gridgen:response.data.data.p2ValueTot, loadconsumption:response.data.data.p3ValueTot})
       
        const data = response.data.data;
        
        if (data.dataCharts.length > 0) {
          const t = new Date();

          // Get current time in HH:mm format in Asia/Kolkata timezone
          const currTime = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata"
          }).format(t);
          
          // Ensure dataCharts is not empty
          if (data.dataCharts.length === 0) {
            console.error("dataCharts is empty!");
          } else {
            const check = data.dataCharts[data.dataCharts.length - 1].ccAxisXValue;
            console.log("Last recorded time:", check);
          
            // Parse currTime and check (both in "HH:mm" format)
            const [currHours, currMinutes] = currTime.split(":").map(Number);
            const [checkHours, checkMinutes] = check.split(":").map(Number);
          
            // Create Date objects for both times
            const now = new Date();
            const currentDateTime = new Date(now);
            currentDateTime.setHours(currHours, currMinutes, 0, 0);
          
            const checkDateTime = new Date(now);
            checkDateTime.setHours(checkHours, checkMinutes, 0, 0);
          
            // If check time is ahead of current time, assume it's from the previous day
            if (checkDateTime > currentDateTime) {
              checkDateTime.setDate(checkDateTime.getDate() - 1);
            }
          
            // Calculate the absolute difference in minutes
            const diffInMinutes = Math.abs((currentDateTime - checkDateTime) / (1000 * 60));
            console.log("Time Difference (minutes):", diffInMinutes);
          
            // Compare and trigger alert
            if (diffInMinutes <= 30) {
              console.log("✅ Success:", diffInMinutes);
              showAlert("success");
            } else {
              console.log("❌ Danger:", diffInMinutes);
              showAlert("danger");
            }
          }
          
        } else {
          showAlert("danger");
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.message === 'No internet connection. Please check your network.') {
        setError(err.message);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };


const updatedEngergies=(solargen, gridgen,loadconsumption )=>{

  console.log("Updated Energies:", solargen, gridgen, loadconsumption);
   setEnergies({
    solargen:solargen,
    gridgen:gridgen,
    loadconsumption:loadconsumption
   })

}


  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.location.isSidebarOpen);
  const allLocations = useSelector((state) => state.location.locations);

  const getDeviceCapacity = () => {
  if (!device?.name || !Array.isArray(allLocations)) return 'N/A';
  const match = allLocations.find((loc) => loc.name === device.name);
  return match?.capacity || 'N/A';
};


  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    if (device?.path) fetchData(device.path, device.timeInterval);
  }, [device]);

  // Error display component
  const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-start h-screen w-full pt-28">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md">
        <img 
          src="/images/error-illustration.svg" 
          alt="Error" 
          className="w-32 h-32 mx-auto mb-4" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VmNDQ0NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIj48L2NpcmNsZT48bGluZSB4MT0iMTIiIHkxPSI4IiB4Mj0iMTIiIHkyPSIxMiI+PC9saW5lPjxsaW5lIHgxPSIxMiIgeTE9IjE2IiB4Mj0iMTIuMDEiIHkyPSIxNiI+PC9saW5lPjwvc3ZnPg==";
          }}
        />
        <h3 className="text-red-600 text-xl font-bold mb-2 text-center">Connection Error</h3>
        <p className="text-gray-700 text-center">{message}</p>
        <button 
          onClick={() => {
            if (device?.path) fetchData(device.path, device.timeInterval);
          }}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="h flex flex-col md:px-6 gap-0 pb-[100px] md:pb-0">
      <div>
         <button
          onClick={handleToggle}
          className="p-2 bg-blue-600 text-white m-2 rounded-md shadow-md flex items-center"
        >
          <Menu size={20} />
        </button>
        <button className="bg-blue-500 text-white rounded-full hover:bg-blue-600 py-1 px-3" onClick={()=>handlePageChange("mainPage")}>
             <ArrowLeft size={24} color="white" /></button>
        {/* Tab Navigation */}
        <div className='flex justify-center'>
          <div className="inline-flex border items-center rounded-full bg-white justify-center border-gray-300">
            {['Overview', 'Analytics'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 focus:outline-none ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 bg-blue-500 text-white rounded-full font-semibold'
                    : 'text-gray-500 font-bold'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loader */}
        {loading && <Spinner />}

        {/* Error Message with Image */}
        {error && <ErrorDisplay message={error} />}

        {/* Content */}
        {!loading && !error && liveData && (
          <div className="mt-4">
            {activeTab === 'Overview' && (
              <div>
              <StatusCard 
  device={device?.name || 'kollar'} 
  type={device?.type || 'unknown'}
  alert={alert} 
  lastupdate={liveData.data.snapshot.tValue}
  updatedEngergies={updatedEngergies}
  capacity={getDeviceCapacity()}
/>

                <EnergyConsumption generation={energies}  />
                <ParameterRepresentation parameters={liveData.data.snapshot}  device={device?.name || 'kollar'} 
                  type={device?.type || 'unknown'} />
              </div>
            )}
            {activeTab === 'Analytics' && (
              <Graph 
                site={device?.name || 'kollar'} 
                dataCharts={liveData.data.dataCharts} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;