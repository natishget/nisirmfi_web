import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./API/counterSlice";
import apiReducer from "./api/ApiSlice";

export const store = configureStore({
  reducer: {
    api: apiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
