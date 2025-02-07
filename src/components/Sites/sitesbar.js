import { useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux'
import { updateLocation } from '../Redux/CounterSlice'
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


export default function Sitesbar({ isOpen, toggleSidebar }) {
  // Additional data items
  


  const additionalData = [
    { name: "kollar", path: "ftb001",board: "ftb001", },
    { name: "modaiyur", path: "stb001", board: "stb001", },
    { name: "ananthapuram", path: "nrmsv2f001", board: "nrmsv2f001", },
    { name: "vengur", path: "rmsv3_001", board: "rmsv3_001", },
    { name: "sithalingamadam", path: "rmsv3_002", board: "rmsv3_002", },
    { name: "keelathalanur", path: "rmsv32_001", board: "rmsv32_001", },
    { name: "perumukkal", path: "rmsv33_001", board: "rmsv33_001", },
    { name: "agalur", path: "rmsv33_002", board: "rmsv33_002", },
    { name: "saram", path: "rmsv33_005", board: "rmsv33_005", },
    { name: "pootai", path: "rmsv34_002", board: "rmsv34_002", },
    { name: "siruvanthadu", path: "rmsv34_003", board: "rmsv34_003", },
    { name: "puthirampattu", path: "rmsv35_002", board: "rmsv35_002", },
    { name: "vadalur", path: "rmsv35_003", board: "rmsv35_003", },
    { name: "alagarai", path: "rmsv35_007", board: "rmsv35_007", },
    { name: "kanniyapuram", path: "rmsv35_008", board: "rmsv35_008", },
    { name: "melmalaiyanur", path: "rmsv4_001", board: "rmsv4_001", },
    { name: "thandavankulam", path: "rmsv4_002", board: "rmsv4_002", },
    { name: "channamahgathihalli ka", path: "rmsv35_006", board: "rmsv35_006", },
    { name: "jenugadde ka", path: "rmsv35_014", board: "rmsv35_014", },
    { name: "sindigere ka", path: "rmsv35_015", board: "rmsv35_015", },
    { name: "Panchalingala Ap", path: "Panchalingala-AP", board: "rmsv36_001", },
    { name: "Nudurupadu-Ap", path: "Nudurupadu-AP", board: "rmsv35_005", },
    // { name: "testing", path: "rmsv33_003", board: "rmsv33_003", },
    // { name: "testing", path: "rmsv33_004", board: "rmsv33_004", },
    // { name: "testing", path: "rmsv33_007", board: "rmsv33_007", },
    // { name: "testing", path: "rmsv34_004", board: "rmsv34_004", },
    // { name: "testing", path: "rmsv34_005", board: "rmsv34_005", },
    // { name: "testing", path: "rmsv35_001", board: "rmsv35_001", },
    // { name: "testing", path: "rmsv35_004", board: "rmsv35_004", },
    // { name: "testing", path: "rmsv35_005", board: "rmsv35_005", },
    // { name: "testing", path: "rmsv35_009", board: "rmsv35_009", },
    // { name: "testing", path: "rmsv35_010", board: "rmsv35_010", },
    // { name: "testing", path: "rmsv35_011", board: "rmsv35_011", },
    // { name: "testing", path: "rmsv35_012", board: "rmsv35_012", },
    // { name: "testing", path: "rmsv35_013", board: "rmsv35_013", },
    // { name: "testing", path: "rmsv35_016", board: "rmsv35_016", },
    // { name: "testing", path: "rmsv35_017", board: "rmsv35_017", },
    // { name: "testing", path: "rmsv35_018", board: "rmsv35_018", },
    // { name: "testing", path: "rmsv35_019", board: "rmsv35_019", },
    // { name: "testing", path: "rmsv35_020", board: "rmsv35_020", },
    // { name: "testing", path: "rmsv4_003" , board: "rmsv4_003",},
    // { name: "testing", path: "rmsv4_004", board: "rmsv4_004", },
    // { name: "testing", path: "rmsv4_005", board: "rmsv4_005", },
   
    // { name: "testing", path: "rmsv36_002", board: "rmsv36_002", },
    // { name: "testing", path: "rmsv36_004", board: "rmsv36_004", },
    // { name: "testing", path: "rmsv36_005", board: "rmsv36_005", },
    // { name: "testing", path: "rmsv36_006", board: "rmsv36_006", },
    // { name: "testing", path: "rmsv36_007", board: "rmsv36_007", },
    // { name: "testing", path: "rmsv36_008", board: "rmsv36_008", },
    // { name: "testing", path: "rmsv36_009", board: "rmsv36_009", },
    // { name: "testing", path: "rmsv36_010", board: "rmsv36_010", },
    // { name: "testing", path: "rmsv36_011", board: "rmsv36_011", },
    // { name: "testing", path: "rmsv36_012", board: "rmsv36_012", }
  ];





  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

const dispatch=useDispatch()

 
// const handleMenuItemClick = (item, location) => {
//   console.log(item, location)
//   setSelectedItem(item);
//   Cookies.set("selectedItem", item);
//   Cookies.set("setLocation", location);
//   setLocation(location);
//   fetchData(item);
//   setNav(!nav);
// };


const changeLocation = (data) => {
 
  dispatch(updateLocation(data));
  setSelectedLocation(data);
  toggleSidebar()
  Cookies.set("locationName", data.name);
  Cookies.set("locationPath", data.path);
  Cookies.set("locationBoard", data.board);
  navigate("/");
  
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
