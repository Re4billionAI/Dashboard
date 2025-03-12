import { createSlice } from '@reduxjs/toolkit';

// Function to get cookie value by name
const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

// Retrieve cookie values
const initialDevice = {
  name: getCookie('locationName') || 'Kollar-TN',
  path: getCookie('locationPath') || 'ftb001',
  board: getCookie('locationBoard') || 'ftb001',
  type: getCookie('locationType') || '24v',
  timeInterval: getCookie('locationTimeInterval') || '1'
};

// Additional locations data
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
  { name: "Muthpoor-TG", path: "Muthpoor-TG", board: "rmsv36_005",type:"24v",timeInterval:5 },
  { name: "Ippagudem-TG", path: "Ippagudem-TG", board: "rmsv36_011",type:"24v",timeInterval:5 },
  { name: "Fareedpur-TG", path: "Fareedpur-TG", board: "rmsv36_012",type:"24v",timeInterval:5 },
  { name: "Kollampalli-TG", path: "Kollampalli-TG", board: "rmsv35_01",type:"24v",timeInterval:5 },
  { name: "Testing-rmsv36_012", path: "rmsv36_012", board: "rmsv36_012",type:"24v",timeInterval:5 },
  
 
];


export const locationSlice = createSlice({
  name: 'location',
  initialState: { device: initialDevice, locations: additionalData },
  reducers: {
    updateLocation: (state, action) => {
      state.device = action.payload;
    },
    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },
    setLocations: (state, action) => {
      state.locations = action.payload;
    }
  }
});

// Action creators
export const { updateLocation, addLocation, setLocations } = locationSlice.actions;

export default locationSlice.reducer;
