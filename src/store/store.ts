import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import dataSlice from "../store/slices/data_slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      data_state: dataSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({}).concat(thunk),
  });
};

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
