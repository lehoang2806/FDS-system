import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginApiThunk } from "./authThunk";
import { ResponseFromServer } from "@/types/app";
import { get } from "lodash";
import { AuthResponse, AuthState, UserProfile } from "@/types/auth";

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    userInfo: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string|null>) => {
            state.token = action.payload;
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setUserLogin: (state, action: PayloadAction<UserProfile|null>) => {
            state.userInfo = action.payload;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(loginApiThunk.fulfilled, (state, action: PayloadAction<ResponseFromServer<AuthResponse>>) => {
            let token = get(action, 'payload.token', null);
            let dataUser = get(action, 'payload.userInfo', null);
            
            state.token = token;
            state.isAuthenticated = true;
            state.userInfo = dataUser;
        })
    },
});

export const { setToken, setUserLogin, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
