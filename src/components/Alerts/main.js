import { useState, useEffect } from 'react';
import { Sun, Clock, ArrowUpDown, AlertTriangle, Battery, Zap, Activity } from 'lucide-react';
import axios from 'axios';

// Helper function to format date to DD/MM/YYYY
const formatDateToDDMMYYYY = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Helper to get icon by category
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Voltage':
      return <Zap className="h-4 w-4 text-yellow-500" />;
    case 'Battery':
      return <Battery className="h-4 w-4 text-green-500" />;
    case 'Solar':
      return <Sun className="h-4 w-4 text-orange-500" />;
    case 'Grid':
      return <Activity className="h-4 w-4 text-blue-500" />;
    case 'Inverter':
      return <Zap className="h-4 w-4 text-purple-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
};

// Helper to get severity color
const getSeverityColor = (severity) => {
  switch (severity) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Process the alert data into a standardized format
const processAlertData = (alertData) => {
  if (!alertData) return [];
  
  const commonIssues = [];
  
  // Process common issues if they exist
  if (alertData.commonIssues) {
    Object.entries(alertData.commonIssues).forEach(([location, issues]) => {
      issues.forEach(issue => {
        // Extract state code if available
        const locationParts = location.split('-');
        const statePart = locationParts.length > 1 ? locationParts[locationParts.length - 1] : '';
        const stateCode = statePart.includes(' ') ? statePart.split(' ')[1] : '';
        
        // Format the location name (remove device prefix if present)
        let locationName = location;
        if (locationParts.length > 1) {
          locationName = locationParts.slice(1).join('-');
        }
        
        // Extract issue type and details
        let errorMessage = issue.message;
        const locationPrefix = `${location}-`;
        if (errorMessage.startsWith(locationPrefix)) {
          errorMessage = errorMessage.substring(locationPrefix.length);
        }
        
        const errorParts = errorMessage.split(':');
        const errorType = errorParts[0].trim();
        const errorDetails = errorParts.length > 1 ? errorParts[1].trim() : '';
        
        // Category by error type
        let category = '';
        if (errorType.includes('voltage')) category = 'Voltage';
        else if (errorType.includes('Battery')) category = 'Battery';
        else if (errorType.includes('Solar') || errorType.includes('MPPT')) category = 'Solar';
        else if (errorType.includes('Grid')) category = 'Grid';
        else if (errorType.includes('Inverter')) category = 'Inverter';
        else category = 'Other';
        
        commonIssues.push({
          location: locationName,
          stateCode: stateCode,
          errorType: errorType,
          errorDetails: errorDetails,
          category: category,
          count: issue.count,
          severity: issue.count >= 10 ? 'High' : issue.count >= 5 ? 'Medium' : 'Low'
        });
      });
    });
  }
  
  // Process hourly results for more entries if they exist
  if (alertData.filteredHourlyResults) {
    const uniqueEntries = new Set();
    alertData.filteredHourlyResults.forEach(hourData => {
      Object.entries(hourData.filteredErrorCounts || {}).forEach(([location, errors]) => {
        // Format the location name
        const locationParts = location.split('-');
        const statePart = locationParts.length > 1 ? locationParts[locationParts.length - 1] : '';
        const stateCode = statePart.includes(' ') ? statePart.split(' ')[1] : '';
        
        let locationName = location;
        if (locationParts.length > 1) {
          locationName = locationParts.slice(1).join('-');
        }
        
        Object.entries(errors).forEach(([errorMessage, count]) => {
          // Skip if already added in common issues
          const entryKey = `${location}-${errorMessage}`;
          if (uniqueEntries.has(entryKey)) return;
          uniqueEntries.add(entryKey);
          
          const errorParts = errorMessage.split(':');
          const errorType = errorParts[0].trim();
          const errorDetails = errorParts.length > 1 ? errorParts[1].trim() : '';
          
          // Category by error type
          let category = '';
          if (errorType.includes('voltage')) category = 'Voltage';
          else if (errorType.includes('Battery')) category = 'Battery';
          else if (errorType.includes('Solar') || errorType.includes('MPPT')) category = 'Solar';
          else if (errorType.includes('Grid')) category = 'Grid';
          else if (errorType.includes('Inverter')) category = 'Inverter';
          else category = 'Other';
          
          commonIssues.push({
            location: locationName,
            stateCode: stateCode,
            errorType: errorType,
            errorDetails: errorDetails,
            category: category,
            count: count,
            severity: count >= 10 ? 'High' : count >= 5 ? 'Medium' : 'Low'
          });
        });
      });
    });
  }
  
  return commonIssues;
};

export default function SolarMonitoringTable() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('morning');
  const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'desc' });
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Fetch data from API
  useEffect(() => {
    
    const formatDateToDDMMYYYY = (isoDate) => {
      if (!isoDate) return '';
      const [year, month, day] = isoDate.split('-');
      return `${day}-${month}-${year}`;
    };
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST}/admin/alerts`,
          { date: formatDateToDDMMYYYY(date) }
        );
        
        // Changed this section to handle both single and multiple alerts
        if (response.data?.alerts) {
          console.log('API Response:', response.data.alerts);
          setData(response.data.alerts);
          setError(null);
        } else {
          console.log('No alerts found in response');
          setData([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);
  
  // Get active data based on tab (handling single report case)
  const morningData = data.length > 0 ? processAlertData(data[0]) : [];
  const eveningData = data.length > 1 ? processAlertData(data[1]) : [];
  
  const activeData = activeTab === 'morning' ? morningData : eveningData;
  const timestamp = data.length > 0 ? 
    (activeTab === 'morning' ? (data[0]?.timestamp || 'No Data') : 
      (data.length > 1 ? (data[1]?.timestamp || 'No Data') : 'No Data')) :
    'No Data';
  
  const categories = ['All', 'Voltage', 'Battery', 'Solar', 'Grid', 'Inverter', 'Other'];
  
  // Filter data by category
  const filteredData = filterCategory === 'All' 
    ? activeData 
    : activeData.filter(item => item.category === filterCategory);
  
  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  
  // Check if evening data is available for tab display
  const hasEveningData = data.length > 1;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <Sun className="mr-2 h-6 w-6 text-yellow-500" />
            Solar System Monitoring Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">{formatDateToDDMMYYYY(date)}</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-6 w-full sm:px-6 lg:px-8 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading data...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-blue-50 p-4 rounded-md text-blue-700 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>No data available for the selected date.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Time period selector - Only show if we have evening data */}
            {hasEveningData && (
              <div className="flex mb-6 bg-white rounded-lg shadow overflow-hidden">
                <button
                  className={`flex-1 py-2 px-4 font-medium ${activeTab === 'morning' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('morning')}
                >
                  Morning Report {data[0]?.timestamp ? `(${data[0].timestamp.split(' ')[1] || ''})` : ''}
                </button>
                <button
                  className={`flex-1 py-2 px-4 font-medium ${activeTab === 'evening' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('evening')}
                >
                  Evening Report {data[1]?.timestamp ? `(${data[1].timestamp.split(' ')[1] || ''})` : ''}
                </button>
              </div>
            )}
            
            {/* Filter and summary */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Alert Report • {timestamp}
                </h2>
                
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <span className="text-sm text-gray-500">Filter by:</span>
                  <div className="relative">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-md p-3">
                    <p className="text-xs text-blue-500 font-medium">Total Issues</p>
                    <p className="text-2xl font-bold text-blue-700">{sortedData.length}</p>
                  </div>
                  <div className="bg-red-50 rounded-md p-3">
                    <p className="text-xs text-red-500 font-medium">High Severity</p>
                    <p className="text-2xl font-bold text-red-700">
                      {sortedData.filter(item => item.severity === 'High').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-md p-3">
                    <p className="text-xs text-yellow-500 font-medium">Medium Severity</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {sortedData.filter(item => item.severity === 'Medium').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-md p-3">
                    <p className="text-xs text-green-500 font-medium">Low Severity</p>
                    <p className="text-2xl font-bold text-green-700">
                      {sortedData.filter(item => item.severity === 'Low').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('category')}
                      >
                        <div className="flex items-center">
                          Category
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('location')}
                      >
                        <div className="flex items-center">
                          Location
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('errorType')}
                      >
                        <div className="flex items-center">
                          Issue Type
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('count')}
                      >
                        <div className="flex items-center">
                          Count
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('severity')}
                      >
                        <div className="flex items-center">
                          Severity
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedData.length > 0 ? (
                      sortedData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getCategoryIcon(item.category)}
                              <span className="ml-2 text-sm text-gray-900">{item.category}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.location}</div>
                            {item.stateCode && (
                              <div className="text-xs text-gray-500">{item.stateCode}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{item.errorType}</div>
                            {item.errorDetails && (
                              <div className="text-xs text-gray-500">{item.errorDetails}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.count}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(item.severity)}`}>
                              {item.severity}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No alerts found for the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      
    
    </div>
  );
}