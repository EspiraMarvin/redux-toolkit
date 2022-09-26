import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import usersReducer from '../features/users/usersSlice';


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        users: usersReducer
    },
    // this middleware from apiSlice (apiSlice.middleware) manages cache lifetimes and expirations
    middleware: getDefaultMiddleware => 
            getDefaultMiddleware().concat(apiSlice.middleware)
})