import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Grid, Sun, Power, Search, Zap } from 'lucide-react';

// Define the initial data URL
const DATA_URL = 'http://127.0.0.1:5001/rmstesting-d5aa6/us-central1/firebackend/admin/allSitesBriefData';

// Colors for the charts
const COLORS = ['#34a853', '#1a73e8', '#fbbc05'];

export default function BrieData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'siteName', direction: 'ascending' });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', or 'inactive'

  // Fetch data on component mount 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real application, this would be a fetch call
        // For demo, we're simulating the fetch with a timeout
        setTimeout(async () => {
          try {
            // For demo purposes - in production this would be:
            const response = await fetch(DATA_URL);
            const jsonData = await response.json();
            
            // Using the sample data from the paste.txt file  
            
            // Add a simulated delay for loading
            setData(jsonData);
          } catch (err) {
            setError('Failed to load data. Please try again later.');
          } finally {
            setLoading(false);
          }
        }, 1500);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh data function
  const refreshData = () => {
    setLoading(true);
    // In a real application, this would refetch the data
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  // Format the date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  // Calculate site status based on new logic
 const calculateSiteStatus = (site) => {
  const currentTime = Date.now(); // Current time in milliseconds
  const lastUpdateTime = site.latestValues?.tValue || 0; // Last update time in seconds
  const lastUpdateInMs = lastUpdateTime * 1000; // Convert to milliseconds
  
  // Calculate time difference in minutes
  const timeDifferenceMinutes = (currentTime - lastUpdateInMs) / (1000 * 60);
  
  const batteryVoltage = site.latestValues?.batteryVoltage || 0;
  
  let status, statusColor;
  
  // Site is inactive if more than 30 minutes have passed OR battery is critically low
  if (timeDifferenceMinutes > 30 || batteryVoltage <= 0.1) {
    status = "Inactive";
    statusColor = "bg-red-100 text-red-800";
  } else {
    status = "Active";
    statusColor = "bg-green-100 text-green-800";
  }
  
  return { status, statusColor, isActive: status === "Active" };
};
  

  // Filter sites based on search term and active tab
  const filteredSites = data?.sites?.filter(site => {
    const matchesSearch = site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          site.siteId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const siteStatus = calculateSiteStatus(site);
    
    if (activeTab === 'all') {
      return matchesSearch;
    } else if (activeTab === 'active') {
      return matchesSearch && siteStatus.isActive;
    } else if (activeTab === 'inactive') {
      return matchesSearch && !siteStatus.isActive;
    }
    
    return matchesSearch;
  }) || [];

  // Sort sites based on sort configuration
  const sortedSites = [...filteredSites].sort((a, b) => {
    // Handle sorting for dailySummary values
    if (sortConfig.key.includes('.')) {
      const [parent, child] = sortConfig.key.split('.');
      const aValue = parseFloat(a[parent][child]);
      const bValue = parseFloat(b[parent][child]);
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle basic sorting
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting changes
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Prepare data for the energy distribution pie chart
  const energyDistribution = data ? [
    { name: 'Solar Energy', value: parseFloat(data.aggregateSummary.totalSolarEnergy) },
    { name: 'Grid Energy', value: parseFloat(data.aggregateSummary.totalGridEnergy) },
    { name: 'Inverter Energy', value: parseFloat(data.aggregateSummary.totalInverterEnergy) }
  ] : [];

  // Calculate total active and inactive sites
  const activeSitesCount = data?.sites?.filter(site => calculateSiteStatus(site).isActive)?.length || 0;
  const inactiveSitesCount = (data?.totalSites || 0) - activeSitesCount;

  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-lg text-gray-700">Loading solar monitoring data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={refreshData} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                  <Sun className="mr-2 text-yellow-500" size={32} />
                  Solar Sites Monitoring Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Last updated: {formatDate(data?.timestamp)}
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

          {/* Dashboard Summary */}
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
                  <p className="text-2xl font-bold">{data?.aggregateSummary.totalSolarEnergy
 || 0}kWh</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Power className="text-red-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase">Grid Energy</p>
                  <p className="text-2xl font-bold">{data?.aggregateSummary.totalGridEnergy
 || 0}kWh</p>
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

          {/* Charts - Now with just the Energy Distribution chart */}
          <div className="mb-8">
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
          </div>

          {/* Site Data Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-xl font-bold mb-4 md:mb-0">Site Data</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sites..."
                    className="pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'all' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-blue-500 hover:text-blue-700'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Sites ({data?.totalSites || 0})
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'active' 
                    ? 'border-b-2 border-green-500 text-green-600' 
                    : 'text-green-500 hover:text-green-700'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Active Sites ({activeSitesCount})
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'inactive' 
                    ? 'border-b-2 border-red-500 text-red-600' 
                    : 'text-red-500 hover:text-red-700'
                }`}
                onClick={() => setActiveTab('inactive')}
              >
                Inactive Sites ({inactiveSitesCount})
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('siteName')}
                    >
                      Site Name
                      {sortConfig.key === 'siteName' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}↓
                        </span>
                      )}
                    </th>
                   
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('dailySummary.solarEnergy')}
                    >
                      Solar Energy (kWh)
                      {sortConfig.key === 'dailySummary.solarEnergy' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}↓
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('dailySummary.gridEnergy')}
                    >
                      Grid Energy (kWh)
                      {sortConfig.key === 'dailySummary.gridEnergy' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}↓
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort('dailySummary.inverterEnergy')}
                    >
                      Inverter Energy (kWh)
                      {sortConfig.key === 'dailySummary.inverterEnergy' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}↓
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                      Battery Voltage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                      Last Update
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSites.length > 0 ? (
                    sortedSites.map((site) => {
                      // Get status using the new logic
                      const { status, statusColor } = calculateSiteStatus(site);
                      
                      return (
                        <tr key={site.siteId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{site.siteName}</div>
                          </td>
                        
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {site.dailySummary.solarEnergy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {site.dailySummary.gridEnergy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {site.dailySummary.inverterEnergy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {site.latestValues.batteryVoltage.toFixed(2)} V
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {site.latestValues.tValue*1000 ? formatDate(site.latestValues.tValue*1000) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No sites found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-700">
                Showing {sortedSites.length} of {data?.sites?.length || 0} sites
              </p>
            </div>
          </div>  
        </div>
      )}
    </div>
  );
}