import { createSlice } from "@reduxjs/toolkit";
import { localStorage_values } from "@/apis/apiEndPoints";
import CryptoJS from "crypto-js";

const TOKEN_KEY = localStorage_values.TOKEN_KEY;
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
  token: localStorage.getItem(TOKEN_KEY)
    ? decrypt(localStorage.getItem(TOKEN_KEY))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
