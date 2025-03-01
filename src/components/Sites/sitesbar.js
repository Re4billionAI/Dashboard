import { useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux'
import { updateLocation } from '../Redux/CounterSlice'
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


export default function Sitesbar({ isOpen, toggleSidebar }) {
  // Additional data items
  


  const additionalData = [
    { name: "Kollar-TN", path: "ftb001",board: "rms35_004",type:"24v", timeInterval:1 },
    { name: "Modaiyur-TN", path: "stb001", board: "stb001",type:"24v",timeInterval:1 },
    { name: "Ananthapuram-TN", path: "nrmsv2f001", board: "nrmsv2f001",type:"24v",timeInterval:5 },
    { name: "Vengur-TN", path: "rmsv3_001", board: "rmsv34_004",type:"24v",timeInterval:1 },
    { name: "Sithalingamadam-TN", path: "rmsv3_002", board: "rmsv34_004", type:"24v",timeInterval:1},
    { name: "Keelathalanur-TN", path: "rmsv32_001", board: "rmsv32_001", type:"24v",timeInterval:5},
    { name: "Perumukkal-TN", path: "rmsv33_001", board: "rmsv35_012",type:"24v",timeInterval:5 },
    { name: "Agalur-TN", path: "rmsv33_002", board: "rmsv34_005",type:"24v",timeInterval:5 },
    { name: "Melmalaiyanur-TN", path: "rmsv4_001", board: "rmsv4_001",type:"48v",timeInterval:1 },
    { name: "Saram-TN", path: "rmsv33_005", board: "rmsv33_005",type:"24v",timeInterval:1 },
    { name: "Pootai-TN", path: "rmsv34_002", board: "rmsv34_002",type:"24v",timeInterval:1 },
    { name: "Siruvanthadu-TN", path: "rmsv34_003", board: "rmsv34_003", type:"24v",timeInterval:1},
    { name: "Puthirampattu-TN", path: "rmsv35_002", board: "rmsv35_002", type:"24v",timeInterval:1},
    { name: "Vadalur-TN", path: "rmsv35_003", board: "rmsv35_003", type:"24v",timeInterval:1},
    { name: "Alagarai-TN", path: "rmsv35_007", board: "rmsv35_007",type:"24v",timeInterval:5 },
    { name: "Kanniyapuram-TN", path: "rmsv35_008", board: "rmsv35_008",type:"24v",timeInterval:5 },
    { name: "Thandavankulam-TN", path: "Thandavankulam-TN", board: "rmsv36_006",type:"48v",timeInterval:1 },
    { name: "Channamahgathihalli KA", path: "rmsv35_006", board: "rmsv35_006",type:"24v",timeInterval:5 },
    { name: "Jenugadde KA", path: "rmsv35_014", board: "rmsv35_014",type:"24v",timeInterval:5 },
    { name: "Sindigere KA", path: "rmsv35_015", board: "rmsv35_015", type:"24v",timeInterval:5},
    { name: "Panchalingala AP", path: "Panchalingala-AP", board: "rmsv36_001",type:"24v",timeInterval:5 },
    { name: "Nudurupadu-AP", path: "Nudurupadu-AP", board: "rmsv35_005", type:"24v",timeInterval:5},
    { name: "Laddagiri-AP", path: "Laddagiri-AP", board: "rmsv36_003",type:"24v",timeInterval:5 },
    { name: "Jambukuttapatti-TN", path: "Jambukuttapatti-TN", board: "rmsv36_009",type:"48v",timeInterval:5 },
    { name: "AyilapetaiKoppu-TN", path: "AyilapetaiKoppu-TN", board: "rmsv36_007",type:"24v",timeInterval:5 },
    { name: "Perumugai-TN", path: "Perumugai-TN", board: "rmsv36_010",type:"48v",timeInterval:5 },
    { name: "Chinnajatram-TG", path: "Chjatram-TG", board: "rmsv36_008",type:"24v",timeInterval:5 },
    { name: "Muthpoor-TG", path: "Muthpoor-TG", board: "rmsv36_002",type:"24v",timeInterval:1 },
   
  ];





  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

const dispatch=useDispatch()

 



const changeLocation = (data) => {
 
  dispatch(updateLocation(data));
  setSelectedLocation(data);
  toggleSidebar()
  Cookies.set("locationName", data.name);
  Cookies.set("locationPath", data.path);
  Cookies.set("locationBoard", data.board);
  Cookies.set("locationType", data.type);
  Cookies.set("locationTimeInterval", data.timeInterval);
  navigate("/");
  setSearchTerm("")
  
  
};


  // Filter the data based on search term (case-insensitive)
  const filteredData = additionalData.filter((data) =>
    data.name.toLowerCase().includes(searchTerm.toLowerCase())||data.board.toLowerCase().includes(searchTerm.toLowerCase())
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
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-indigo-600 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
          />
        </div>

        {/* Additional Data List with Custom Scrollbar */}
        <ul className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
          {filteredData.map((data, index) => (
            <li
              key={index}
              onClick={() => changeLocation(data)}
              className={`px-4 py-2 mr-2 rounded-lg cursor-pointer transition-colors  text-sm ${
                selectedLocation.name === data.name
                  ? "bg-white text-gray-700"
                  : "bg-indigo-500 hover:bg-indigo-900 text-white"
              }`}
            >
              {data.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className=" absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-200/30">
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
