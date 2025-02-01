
import React, { useState } from 'react';
import StatusCard from "./statusCard";
import EnergyConsumption from "./EnergyConsumptions";
import Graph from './graphs';
import ParameterRepresentation from "./parameter";

const Home = () => {
  const [activeTab, setActiveTab] = useState('liveData');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  }
  return (
  

  <div className="w-full h    flex flex-col md:px-6 gap-0 pb-[100px] md:pb-0">
        <div className=''>
      <div className="flex border-b  flex-row items-center justify-center border-gray-200">
        <button
          className={`px-4 py-2 focus:outline-none ${
            activeTab === 'liveData'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => handleTabClick('liveData')}
        >
          Live Data
        </button>
        <button
          className={`px-4 py-2 focus:outline-none ${
            activeTab === 'analytics'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => handleTabClick('analytics')}
        >
          Analytics
        </button>
      </div>
      <div className="mt-4">
        {activeTab === 'liveData' && (
          <div>
            {/* Live Data Content */}
            <StatusCard/>
  <EnergyConsumption/>
  <ParameterRepresentation/>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div>
           <Graph/>
          </div>
        )}
      </div>
    </div>
 
</div>
  
  )
};

export default Home;
