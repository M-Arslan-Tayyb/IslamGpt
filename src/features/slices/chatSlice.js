import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarCollapsed: false, // Default state
  messages: [], // Stores chat messages
  activeChat: null, // Currently active chat
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { toggleSidebar, setMessages, setActiveChat, addMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
