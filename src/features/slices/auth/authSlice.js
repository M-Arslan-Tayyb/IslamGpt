import { createSlice } from "@reduxjs/toolkit";
import { localStorage_values } from "@/apis/apiEndPoints";
import CryptoJS from "crypto-js";

const TOKEN_KEY = localStorage_values.TOKEN_KEY;
const SECRET_KEY = import.meta.env.VITE_LOCALSTORAGE_SECRET_KEY;
const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const initialState = {
  token: localStorage.getItem(TOKEN_KEY)
    ? decrypt(localStorage.getItem(TOKEN_KEY))
    : null,
  //   signupData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      // localStorage.setItem("token", JSON.stringify(action.payload));
    },
    // setSignupData(state, action) {
    //   state.signupData = action.payload;
    // },
    // clearUserData: (state) => {
    //   state.token = null;
    //   state.signupData = null;
    //   state.followers = [];
    //   state.following = [];
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("followers");
    //   localStorage.removeItem("following");
    // },
    // eslint-disable-next-line no-unused-vars
    // logout: (state) => {
    //   // This will reset the entire state to initial values
    //   return initialState;
    // },
  },
});

export const {
  setToken,
  //   setSignupData,
  //   setFollowers,
  //   setFollowing,
  //   clearUserData,
  //   logout,
} = authSlice.actions;

export default authSlice.reducer;
