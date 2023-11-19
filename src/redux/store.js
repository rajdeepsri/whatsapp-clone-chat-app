import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./features/modalSlice";
import chatReducer from "./features/chatSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    chats: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
