import { createSlice } from '@reduxjs/toolkit';

// Function to get cookie value by name
const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

let parsedGeocode = [12.245914085514979, 79.59611009470636]; // default
try {
  const geoCookie = getCookie('locationGeocode');
  if (geoCookie) {
    parsedGeocode = JSON.parse(geoCookie);
  }
} catch (error) {
  console.error('Failed to parse locationGeocode cookie:', error);
}

// Retrieve cookie values
const initialDevice = {
  name: getCookie('locationName') || 'Kollar-TN',
  path: getCookie('locationPath') || 'ftb001',
  board: getCookie('locationBoard') || 'ftb001',
  type: getCookie('locationType') || '24v',
  geocode: parsedGeocode, timeInterval: getCookie('locationTimeInterval') || '1'
};

// Additional locations data
const additionalData = [
  { name: "Kollar-TN", path: "ftb001",board: "rms35_004",type:"24v", geocode: [12.245914085514979, 79.59611009470636], timeInterval:1 },
  { name: "Modaiyur-TN", path: "stb001", board: "stb001",type:"24v", geocode: [12.232884092747348, 79.49285273483387],timeInterval:1 },
  { name: "Ananthapuram-TN", path: "nrmsv2f001", board: "nrmsv2f001",type:"24v",geocode: [12.119422441362495, 79.38236576551719],timeInterval:5 },
  { name: "Vengur-TN", path: "rmsv3_001", board: "rmsv34_004",type:"24v",geocode: [10.812364895087802, 78.77200842316836],timeInterval:1 },
  { name: "Sithalingamadam-TN", path: "rmsv3_002", board: "rmsv34_004", type:"24v",geocode: [11.931114941309213, 79.28076590969235],timeInterval:1},
  { name: "Keelathalanur-TN", path: "rmsv32_001", board: "rmsv32_001", type:"24v", geocode: [11.927369429691284, 79.1959115366784],timeInterval:5},
  { name: "Perumukkal-TN", path: "rmsv33_001", board: "rmsv35_012",type:"24v",geocode: [12.2053318865419, 79.7426921929505],timeInterval:5 },
  { name: "Agalur-TN", path: "rmsv33_002", board: "rmsv34_005",type:"24v",geocode: [12.322467202995817, 79.48391685202753],timeInterval:5 },
  { name: "Melmalaiyanur-TN", path: "rmsv4_001", board: "rmsv4_001",type:"48v", geocode: [12.3422024756704, 79.3258336162621],timeInterval:1 },
  { name: "Saram-TN", path: "Saram-TN", board: "rmsv33_005",type:"24v", geocode: [12.2351381051585, 79.6491610491931],timeInterval:5 },
  { name: "Pootai-TN", path: "rmsv34_002", board: "rmsv34_002",type:"24v",geocode: [11.8894874998255, 78.9136923623407],timeInterval:1 },
  { name: "Siruvanthadu-TN", path: "rmsv34_003", board: "rmsv34_003", type:"24v",geocode: [11.8720030338827, 79.5807627095937],timeInterval:1},
  { name: "Puthirampattu-TN", path: "rmsv35_002", board: "rmsv35_002", type:"24v",geocode: [11.9581922859929, 78.8987062724214],timeInterval:1},
  { name: "Vadalur-TN", path: "rmsv35_003", board: "rmsv35_003", type:"24v",geocode: [11.5548451303901, 79.5544782238362],timeInterval:1},
  { name: "Alagarai-TN", path: "rmsv35_007", board: "rmsv35_007",type:"24v",  geocode: [10.974388, 78.385641],timeInterval:5 },
  { name: "Kanniyapuram-TN", path: "rmsv35_008", board: "rmsv35_008",type:"24v",geocode: [10.2650, 78.0966], timeInterval:5 },
  { name: "Thandavankulam-TN", path: "Thandavankulam-TN", board: "rmsv36_006",type:"48v",geocode: [11.3189097467824, 79.808258818514],timeInterval:1 },
  { name: "Channamahgathihalli KA", path: "rmsv35_006", board: "rmsv35_006",type:"24v", geocode: [14.308669, 76.810565], timeInterval:5 },
  { name: "Jenugadde KA", path: "rmsv35_014", board: "rmsv35_014",type:"24v", geocode: [13.313985, 75.974005], timeInterval:5 },
  { name: "Sindigere KA", path: "rmsv35_015", board: "rmsv35_015", type:"24v",geocode: [13.313985, 75.974005], timeInterval:5},
  { name: "Panchalingala AP", path: "Panchalingala-AP", board: "rmsv36_001",type:"24v", geocode: [15.8648922788053, 78.0184930139662],timeInterval:5 },
  { name: "Nudurupadu-AP", path: "Nudurupadu-AP", board: "rmsv35_005", type:"24v",  geocode: [16.279553320544, 80.2107223342481],timeInterval:5},
  { name: "Laddagiri-AP", path: "Laddagiri-AP", board: "rmsv36_003",type:"24v", geocode: [15.632905, 77.888107],timeInterval:5 },
  { name: "Jambukuttapatti-TN", path: "Jambukuttapatti-TN", board: "rmsv36_009",type:"48v",geocode: [12.3295609337406, 78.3611553095866],timeInterval:5 },
  { name: "AyilapetaiKoppu-TN", path: "AyilapetaiKoppu-TN", board: "rmsv36_007",type:"24v",geocode: [10.8430395757423, 78.5849487198463],timeInterval:5 },
  { name: "Perumugai-TN", path: "Perumugai-TN", board: "rmsv36_010",type:"48v",geocode: [11.5282757566832, 77.4586361130561],timeInterval:5 },
  { name: "Chinnajatram-TG", path: "Chjatram-TG", board: "rmsv36_008",type:"24v",geocode: [16.693727, 77.583813],timeInterval:5 },
  { name: "Muthpoor-TG", path: "Muthpoor-TG", board: "rmsv36_005",type:"24v", geocode: [17.157687, 78.067739],timeInterval:5 },
  { name: "Ippagudem-TG", path: "Ippagudem-TG", board: "rmsv36_011",type:"24v", geocode: [17.769356, 79.377558],timeInterval:5 },
  { name: "Fareedpur-TG", path: "Fareedpur-TG", board: "rmsv36_012",type:"24v",  geocode: [16.550236, 77.774682],timeInterval:5 },
  { name: "Kollampalli-TG", path: "Kollampalli-TG", board: "rmsv35_01",type:"24v",  geocode: [16.68063, 77.630059],timeInterval:5 },
  { name: "Kurki-KA", path: "Kurki-KA", board: "rmsv36_004",type:"24v", geocode: [14.394696, 75.965068],timeInterval:5 },
  { name: "Arupathy-TN", path: "Arupathy-TN", board: "rmsv36_015",type:"24v", geocode: [11.10425, 79.714584],timeInterval:5 },
  { name: "keelathirupanthuruthi-TN", path: "Keela-TN", board: "rmsv36_014",type:"24v",geocode: [10.859925, 79.08984], timeInterval:5 },
  
  { name: "Kolwadi-MH", path: "Kolwadi-MH", board: "rmsv36_019",type:"24v", geocode: [18.530411, 74.014772],timeInterval:5 },
  { name: "Sashte-MH", path: "Sashte-MH", board: "rmsv36_021  ",type:"24v", geocode: [18.540989, 74.036405],timeInterval:5 },

  { name: "Pisad-GJ", path: "Pisad-GJ", board: "rmsv36_020",type:"24v", geocode: [21.107653, 73.067836],timeInterval:5 },
  { name: "Timba-GJ", path: "Timba-GJ", board: "rmsv36_015",type:"24v", geocode: [21.264865, 73.096398],timeInterval:5 },

  { name: "Tundi-GJ", path: "Tundi-GJ", board: "rmsv36_016",type:"24v", geocode: [21.122221, 73.031595],timeInterval:5 },
  { name: "Tarsadi-GJ", path: "Tarsadi-GJ", board: "rmsv36_023",type:"24v", geocode: [21.061978, 73.132792],timeInterval:5 },

  
  { name: "Gothada-GJ", path: "Gothada-GJ", board: "rmsv36_016",type:"24v", geocode: [21.107653, 73.067836],timeInterval:5 },
  { name: "Tundav-GJ", path: "Tundav-GJ", board: "rmsv36_023",type:"24v", geocode: [21.264865, 73.096398],timeInterval:5 },
  { name: "Dhantej-GJ", path: "Dhantej-GJ", board: "rmsv36_018",type:"24v", geocode: [21.264865, 73.096398],timeInterval:5 },

  { name: "Testing-01", path: "rmsv36_012", board: "rmsv36_012",type:"testing 1", geocode: [12.96227, 80.257758],timeInterval:1 },
  { name: "Testing-02", path: "rmsv36_020", board: "rmsv36_020",type:"testing 2",geocode: [12.96227, 80.257758], timeInterval:1 },
  { name: "Testing-03", path: "rmsv36_004", board: "rmsv36_004 ",type:"testing 3",geocode: [12.96227, 80.257758], timeInterval:1 },
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
