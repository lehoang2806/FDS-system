import { ResponseFromServer } from "@/types/app";
import { AuthResponse, ILoginEmail } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "./authApi";

const AUTH_SIGN_IN_USER = 'AUTH_SIGN_IN_USER';

export const loginApiThunk = createAsyncThunk<ResponseFromServer<AuthResponse>, ILoginEmail>(
    AUTH_SIGN_IN_USER,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await loginApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);
