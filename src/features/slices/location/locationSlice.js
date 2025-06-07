import { createSlice } from "@reduxjs/toolkit";

// Try to get location from localStorage on initial load
const getSavedLocation = () => {
  try {
    console.log("getSavedLocation: Starting...");
    const savedLocation = localStorage.getItem("userLocation");
    console.log("getSavedLocation: Raw localStorage value:", savedLocation);

    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      console.log("getSavedLocation: Parsed location:", location);

      // Validate the location data
      if (
        location &&
        typeof location === "object" &&
        "latitude" in location &&
        "longitude" in location &&
        typeof location.latitude === "number" &&
        typeof location.longitude === "number" &&
        location.latitude !== null &&
        location.longitude !== null
      ) {
        console.log("getSavedLocation: Valid location found:", location);
        return location;
      } else {
        console.log("getSavedLocation: Invalid location data:", location);
      }
    }
  } catch (error) {
    console.error("Error parsing saved location:", error);
  }

  console.log("getSavedLocation: No valid location found, returning default");
  return { latitude: null, longitude: null };
};

// Get the initial location
const initialLocation = getSavedLocation();
console.log("Initial location for Redux store:", initialLocation);

const initialState = {
  userLocation: initialLocation,
};

console.log("Initial Redux state:", initialState);

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setUserLocation: (state, action) => {
      console.log("Redux: Setting user location:", action.payload);
      state.userLocation = action.payload;

      // Also save to localStorage when setting in Redux
      try {
        localStorage.setItem("userLocation", JSON.stringify(action.payload));
        console.log("Redux: Location saved to localStorage");
      } catch (error) {
        console.error("Redux: Error saving location to localStorage:", error);
      }
    },
    clearUserLocation: (state) => {
      console.log("Redux: Clearing user location");
      state.userLocation = { latitude: null, longitude: null };

      // Clear from localStorage as well
      try {
        localStorage.removeItem("userLocation");
        console.log("Redux: Location cleared from localStorage");
      } catch (error) {
        console.error(
          "Redux: Error clearing location from localStorage:",
          error
        );
      }
    },
  },
});

export const { setUserLocation, clearUserLocation } = locationSlice.actions;

export default locationSlice.reducer;
