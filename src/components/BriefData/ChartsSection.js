import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Colors for the charts
const COLORS = ['#34a853', '#1a73e8', '#fbbc05'];

export default function ChartsSection({ chartData }) {
  const { energyDistribution, topSolarSites } = chartData;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Energy Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={energyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {energyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)} kWh`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Top Sites by Solar Energy</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topSolarSites}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="siteName" />
              <YAxis unit=" kWh" />
              <Tooltip formatter={(value) => `${value} kWh`} />
              <Bar dataKey="solarEnergy" fill="#34a853" name="Solar Energy" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}