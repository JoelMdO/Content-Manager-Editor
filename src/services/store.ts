import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import dataSlice from '../slices/data_slice';


export const makeStore = () => {
    return configureStore({
        reducer: {
            data_state: dataSlice
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                }).concat(thunk),
    });
};

// Define RootState and AppDispatch to be able to be used in functions
export type RootState = ReturnType<typeof makeStore>["getState"];
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];