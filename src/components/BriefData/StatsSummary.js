import { Activity, Grid, Sun, Zap } from 'lucide-react';

export default function StatsSummary({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Activity className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase">Total Sites</p>
            <p className="text-2xl font-bold">{data?.totalSites || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Sun className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase">Solar Energy</p>
            <p className="text-2xl font-bold">{data?.aggregateSummary.totalSolarEnergy || 0} kWh</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <div className="flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Grid className="text-yellow-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase">Grid Energy</p>
            <p className="text-2xl font-bold">{data?.aggregateSummary.totalGridEnergy || 0} kWh</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Zap className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase">Inverter Energy</p>
            <p className="text-2xl font-bold">{data?.aggregateSummary.totalInverterEnergy || 0} kWh</p>
          </div>
        </div>
      </div>
    </div>
  );
}