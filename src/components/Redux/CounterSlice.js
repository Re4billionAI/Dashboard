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

export const counterSlice = createSlice({
  name: 'location',
  initialState: { device: initialDevice },
  reducers: {
    updateLocation: (state, action) => {
      state.device = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateLocation } = counterSlice.actions;

export default counterSlice.reducer;
