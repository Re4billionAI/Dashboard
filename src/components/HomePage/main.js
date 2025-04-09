import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import Spinner from "../Loader/loader"

import StatusCard from './statusCard';
import EnergyConsumption from './EnergyConsumptions';
import Graph from './graphs';
import ParameterRepresentation from './parameter';

const Home = () => {
  const device = useSelector((state) => state.location.device);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [alert, showAlert] = useState(null);

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
            const check = data.dataCharts[data.dataCharts.length - 2].ccAxisXValue;
            console.log("Last recorded time:", check);
          
            // Convert HH:mm format to Date object (Asia/Kolkata timezone)
            const [currHours, currMinutes] = currTime.split(":").map(Number);
            const currentDateTime = new Date();
            currentDateTime.setHours(currHours, currMinutes, 0, 0); // Set time
          
            const [checkHours, checkMinutes] = check.split(":").map(Number);
            const checkDateTime = new Date();
            checkDateTime.setHours(checkHours, checkMinutes, 0, 0); // Set time
          
            // Calculate the absolute difference in minutes
            const diffInMinutes = Math.abs((currentDateTime - checkDateTime) / (1000 * 60));
          
            console.log("Time Difference (minutes):", diffInMinutes);
          
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
                  alert={alert} 
                  lastupdate={liveData.data.snapshot.tValue}
                />
                <EnergyConsumption generation={liveData.data} />
                <ParameterRepresentation parameters={liveData.data.snapshot} />
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