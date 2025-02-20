import { localStorage_values } from "@/apis/apiEndPoints";
import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

const USER_KEY = localStorage_values.USER_KEY;
const SECRET_KEY = import.meta.env.VITE_LOCALSTORAGE_SECRET_KEY;
const decrypt = (cipherText) => {
  if (!cipherText) return null; // Avoid errors on empty values
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedText ? JSON.parse(decryptedText) : null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

const initialState = {
  user: localStorage.getItem(USER_KEY)
    ? decrypt(localStorage.getItem(USER_KEY))
    : null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setUser, clearUser } = profileSlice.actions;

export default profileSlice.reducer;
