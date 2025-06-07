import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/authSlice";
import profileReducer from "../slices/auth/profile";
import chatReducer from "../slices/chatSlice";
import { locationSlice } from "../slices/location/locationSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  chat: chatReducer,
  location: locationSlice,
});

export default rootReducer;
