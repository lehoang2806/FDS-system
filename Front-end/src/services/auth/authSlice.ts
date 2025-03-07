import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginApiThunk } from "./authThunk";
import { ResponseFromServer } from "@/types/app";
import { get } from "lodash";
import { AuthResponse, AuthState, UserProfile } from "@/types/auth";

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null
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
            state.user = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(loginApiThunk.fulfilled, (state, action: PayloadAction<ResponseFromServer<AuthResponse>>) => {
            let token = get(action, 'payload.data.access_token', null);
            let dataUser = get(action, 'payload.data.data', null);
            
            state.token = token;
            state.isAuthenticated = true;
            state.user = dataUser;
        });
    },
});

export const { setToken, setUserLogin, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
