import { useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";

export default function Sitesbar({ isOpen, toggleSidebar }) {
  // Additional data items
  const additionalData = [
    "ftb001-Kollar",
    "stb001-Modaiyur",
    "nrmsv2f001-Ananthapuram",
    "rmsv3_001-Vengur",
    "rmsv3_002-Sithalingamadam",
    "rmsv32_001-Keelathalanur",
    "rmsv33_001-Perumukkal",
    "rmsv33_002-Agalur",
    "rmsv33_005-Saram",
    "rmsv34_002-Pootai",
    "rmsv34_003-Siruvanthadu",
    "rmsv35_002-Puthirampattu",
    "rmsv35_003-Vadalur",
    "rmsv35_007- Alagarai",
    "rmsv35_008-Kanniyapuram",
    "rmsv4_001-Melmalaiyanur",
    "rmsv4_002-Thandavankulam",
    "rmsv35_006- Channamahgathihalli KA",
    "rmsv35_014-Jenugadde KA",
    "rmsv35_015-Sindigere KA",
    "rmsv36_003-Ramakrishnapuram AP",
    "rmsv33_003-Testing",
    "rmsv33_004-Testing",
    "rmsv33_007-Testing",
    "rmsv34_004-Testing",
    "rmsv34_005-Testing",
    "rmsv35_001-Testing",
    "rmsv35_004-Testing",
    "rmsv35_005-Testing",
    "rmsv35_009-Testing",
    "rmsv35_010-Testing",
    "rmsv35_011-Testing",
    "rmsv35_012-Testing",
    "rmsv35_013-Testing",
    "rmsv35_016-Testing",
    "rmsv35_017-Testing",
    "rmsv35_018-Testing",
    "rmsv35_019-Testing",
    "rmsv35_020-Testing",
    "rmsv4_003-Testing",
    "rmsv4_004-Testing",
    "rmsv4_005-Testing",
    "rmsv36_001-Testing",
    "rmsv36_002-Testing",
    "rmsv36_004-Testing",
    "rmsv36_005-Testing",
    "rmsv36_006-Testing",
    "rmsv36_007-Testing",
    "rmsv36_008-Testing",
    "rmsv36_009-Testing",
    "rmsv36_010-Testing",
    "rmsv36_011-Testing",
    "rmsv36_012-Testing",
  ];

  const [selectedLocation, setSelectedLocation] = useState("ftb001-Kollar");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the data based on search term (case-insensitive)
  const filteredData = additionalData.filter((data) =>
    data.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-700 to-purple-700 shadow-2xl backdrop-blur-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-200/30">
        <button className="px-4 py-1 bg-indigo-500 rounded-full text-white text-lg font-bold hover:bg-indigo-600 transition-colors">
          sites
        </button>
        <button
          onClick={toggleSidebar}
          className="text-indigo-200 hover:text-white transition-colors"
        >
          <FiX className="text-2xl" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-indigo-200" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-indigo-600 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
          />
        </div>

        {/* Additional Data List with Custom Scrollbar */}
        <ul className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
          {filteredData.map((data, index) => (
            <li
              key={index}
              onClick={() => setSelectedLocation(data)}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors text-white text-sm ${
                selectedLocation === data
                  ? "bg-purple-600"
                  : "bg-indigo-500 hover:bg-indigo-900"
              }`}
            >
              {data}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className=" bottom-0 left-0 right-0 p-4 border-t border-indigo-200/30">
        <p className="text-center text-indigo-200 text-sm">v1.5.0</p>
      </div>

      {/* Custom styles for the scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 6px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          border-top-radius:30px;
          scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
        }
          
      `}</style>
    </div>
  );
}
