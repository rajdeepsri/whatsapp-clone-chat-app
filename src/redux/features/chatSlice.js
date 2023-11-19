import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chattingUser: null,
  imageToSend: "",
  textToSend: "",
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChattingUser: (state, action) => {
      state.chattingUser = action.payload;
    },
    setImageToSend: (state, action) => {
      state.imageToSend = action.payload;
    },
    setTextToSend: (state, action) => {
      state.textToSend = action.payload;
    },
  },
});

export const { setChattingUser, setImageToSend, setTextToSend } =
  chatSlice.actions;

export default chatSlice.reducer;
