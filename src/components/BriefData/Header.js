import { Sun } from 'lucide-react';

export default function DashboardHeader({ timestamp, formatDate, refreshData }) {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Sun className="mr-2 text-yellow-500" size={32} />
            Solar Sites Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Last updated: {formatDate(timestamp)}
          </p>
        </div>
        <button 
          onClick={refreshData} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh Data
        </button>
      </div>
    </header>
  );
}