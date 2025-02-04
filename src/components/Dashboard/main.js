import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { format, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

const DeviceStatus = ({ workingLocations, notWorkingLocations }) => {
  const [activeTab, setActiveTab] = useState('working');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const changeDate = (days) => {
    setSelectedDate((prevDate) => addDays(prevDate, days));
  };

  const refreshDate = () => {
    setSelectedDate(new Date());
  };

  // Compute maximum solar generation among active locations for progress bar calculation
  const maxGeneration =
    workingLocations.length > 0
      ? Math.max(...workingLocations.map(loc => loc.solarGeneration))
      : 1;

  return (
    <div className="p-4 w-full mx-auto text-gray-900">
      {/* Header with Date Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="md:text-4xl text-xl font-bold mb-4 md:mb-0">
          Solar Generation Dashboard
        </h2>
        <div className="flex items-center gap-2 p-4 py-2 border rounded-full shadow-md bg-gray-100">
          <button
            onClick={() => changeDate(-1)}
            className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className="p-2 border rounded-lg bg-white"
          />
          <button
            onClick={() => changeDate(1)}
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
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all shadow-md flex items-center gap-2 ${
            activeTab === 'working'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => setActiveTab('working')}
        >
          <CheckCircleIcon className="w-6 h-6" /> Active
        </button>
        <button
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all shadow-md flex items-center gap-2 ${
            activeTab === 'notWorking'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
              : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => setActiveTab('notWorking')}
        >
          <XCircleIcon className="w-6 h-6" /> Inactive
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
                const progress =
                  (location.solarGeneration / maxGeneration) * 100;
                return (
                  <li
                    key={index}
                    className="text-lg bg-green-100 p-4 rounded-lg shadow-md font-medium"
                  >
                    <div className="flex justify-between items-center">
                      <span>{location.name}</span>
                      <span className="text-green-700 font-bold">
                        {location.solarGeneration} kW
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
                  className="text-lg bg-red-100 p-4 rounded-lg shadow-md font-medium flex justify-between"
                >
                  <span>{location.name}</span>
                  <span className="text-red-700 font-bold">
                    {location.solarGeneration} kW
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
          <div className="bg-white p-6 rounded-lg shadow-xl border-l-8 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-3xl font-bold text-green-600 flex items-center gap-2">
                <CheckCircleIcon className="w-8 h-8" /> Active 
              </h3>
              <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-bold leading-none text-white bg-blue-600 rounded-full">
                {workingLocations.length}
              </span>
            </div>
            <ul className="list-none space-y-4">
              {workingLocations.length > 0 ? (
                workingLocations.map((location, index) => {
                  const progress =
                    (location.solarGeneration / maxGeneration) * 100;
                  return (
                    <li
                      key={index}
                      className="text-lg bg-green-100 p-4 rounded-lg shadow-md font-medium"
                    >
                      <div className="flex justify-between items-center">
                        <span>{location.name}</span>
                        <span className="text-green-700 font-bold">
                          {location.solarGeneration} kW
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
          <div className="bg-white p-6 rounded-lg shadow-xl border-l-8 border-red-500">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-3xl font-bold text-red-600 flex items-center gap-2">
                <XCircleIcon className="w-8 h-8" /> Inactive 
              </h3>
              <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-bold leading-none text-white bg-blue-600 rounded-full">
                {notWorkingLocations.length}
              </span>
            </div>
            <ul className="list-none space-y-4">
              {notWorkingLocations.length > 0 ? (
                notWorkingLocations.map((location, index) => (
                  <li
                    key={index}
                    className="text-lg bg-red-100 p-4 rounded-lg shadow-md font-medium flex justify-between"
                  >
                    <span>{location.name}</span>
                    <span className="text-red-700 font-bold">
                      {location.solarGeneration} kW
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
        )}
      </div>
    </div>
  );
};

const App = () => {
  const workingLocations = [
    { name: 'Kollar', solarGeneration: 50 },
    { name: 'Perumukkal', solarGeneration: 45 },
    { name: 'modaiyur', solarGeneration: 60 },
    { name: 'agalur', solarGeneration: 55 },
    { name: 'kanyapuram', solarGeneration: 70 },
  ];

  const notWorkingLocations = [
    { name: 'vadalur', solarGeneration: 0 },
    { name: 'saram', solarGeneration: 0 },
    { name: 'pootai', solarGeneration: 0 },
  ];

  return (
    <div className="bg-sky-100 min-h-screen flex items-start justify-center mb-20 md:mb-0">
      <DeviceStatus
        workingLocations={workingLocations}
        notWorkingLocations={notWorkingLocations}
      />
    </div>
  );
};

export default App;
