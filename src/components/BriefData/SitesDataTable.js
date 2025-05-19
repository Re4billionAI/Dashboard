import { Search } from 'lucide-react';

export default function SitesDataTable({ 
  sortedSites, 
  searchTerm, 
  setSearchTerm, 
  sortConfig, 
  requestSort,
  totalSites
}) {
  return (
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
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader sortConfig={sortConfig} requestSort={requestSort} />
          <TableBody sortedSites={sortedSites} />
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-700">
          Showing {sortedSites.length} of {totalSites} sites
        </p>
      </div>
    </div>
  );
}

function TableHeader({ sortConfig, requestSort }) {
  return (
    <thead className="bg-gray-50">
      <tr>
        <SortableHeader 
          label="Site Name" 
          sortKey="siteName" 
          sortConfig={sortConfig} 
          requestSort={requestSort} 
        />
        <SortableHeader 
          label="Site ID" 
          sortKey="siteId" 
          sortConfig={sortConfig} 
          requestSort={requestSort} 
        />
        <SortableHeader 
          label="Solar Energy (kWh)" 
          sortKey="dailySummary.solarEnergy" 
          sortConfig={sortConfig} 
          requestSort={requestSort} 
        />
        <SortableHeader 
          label="Grid Energy (kWh)" 
          sortKey="dailySummary.gridEnergy" 
          sortConfig={sortConfig} 
          requestSort={requestSort} 
        />
        <SortableHeader 
          label="Inverter Energy (kWh)" 
          sortKey="dailySummary.inverterEnergy" 
          sortConfig={sortConfig} 
          requestSort={requestSort} 
        />
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Battery Voltage
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>
  );
}

function SortableHeader({ label, sortKey, sortConfig, requestSort }) {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => requestSort(sortKey)}
    >
      {label}
      {sortConfig.key === sortKey && (
        <span className="ml-2">
          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
        </span>
      )}
    </th>
  );
}

function TableBody({ sortedSites }) {
  if (sortedSites.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
            No sites found matching your search criteria.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {sortedSites.map((site) => {
        // Calculate status based on data
        const status = calculateSiteStatus(site);
        
        return (
          <tr key={site.siteId} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{site.siteName}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {site.siteId}
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
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                {status.label}
              </span>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

function calculateSiteStatus(site) {
  const hasSolarEnergy = parseFloat(site.dailySummary.solarEnergy) > 0;
  const hasGridEnergy = parseFloat(site.dailySummary.gridEnergy) > 0;
  const hasInverterEnergy = parseFloat(site.dailySummary.inverterEnergy) > 0;
  
  if (hasSolarEnergy && hasInverterEnergy) {
    return { label: "Active", color: "bg-green-100 text-green-800" };
  } else if (hasGridEnergy && hasInverterEnergy) {
    return { label: "Grid Power", color: "bg-yellow-100 text-yellow-800" };
  } else if (!hasSolarEnergy && !hasGridEnergy && !hasInverterEnergy) {
    return { label: "Inactive", color: "bg-red-100 text-red-800" };
  } else {
    return { label: "Partial", color: "bg-blue-100 text-blue-800" };
  }
}