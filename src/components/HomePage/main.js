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
  const [alert,showAlert ] = useState(null);

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
        { selectedItem: item, timeInterval:timeInterval },
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
          
          console.log({ currTime });
          
          // Ensure dataCharts is not empty
          if (data.dataCharts.length === 0) {
            console.error("dataCharts is empty!");
          } else {
            const check = data.dataCharts[data.dataCharts.length - 1].ccAxisXValue;
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
            
          showAlert( "danger");
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

  return (
    <div className="w-full h flex flex-col md:px-6 gap-0 pb-[100px] md:pb-0">
      <div>
        {/* Tab Navigation */}
        <div className="flex border-b flex-row items-center justify-center border-gray-200">
          {['Overview', 'Analytics'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 focus:outline-none ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loader */}
        {loading && (
          <Spinner/>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center  h-screen w-full mt-4">{error}</p>}

        {/* Content */}
        {!loading && (
          <div className="mt-4">
            {activeTab === 'Overview' && (
              <div>
                <StatusCard device={device?.name || 'kollar'}alert={alert}   lastupdate={liveData.data.snapshot.tValue}/>
                <EnergyConsumption generation={liveData.data}/>
                <ParameterRepresentation  parameters={liveData.data.snapshot}/>
              </div>
            )}
            {activeTab === 'Analytics' && <Graph dataCharts={liveData.data.dataCharts} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
