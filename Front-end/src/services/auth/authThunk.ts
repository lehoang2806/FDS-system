import { ResponseFromServer } from "@/types/app";
import { AuthResponse, ILoginEmail, IRegisterEmail, TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, requestOTPApi, requestOtpForgetPasswordApi, resetPasswordApi, verifyOTPApi } from "./authApi";

const AUTH_SIGN_IN_USER = 'AUTH_SIGN_IN_USER';
const AUTH_SIGN_UP_USER = 'AUTH_SIGN_UP_USER';
const REQUEST_OTP = 'REQUEST_OTP';
const VERIFY_OTP = 'VERIFY_OTP';
const REQUEST_OTP_FORGET_PASSWORD = 'REQUEST_OTP_FORGET_PASSWORD';
const RESET_PASSWORD = 'RESET_PASSWORD';

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

export const registerApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, IRegisterEmail>(
    AUTH_SIGN_UP_USER,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await registerApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const requestOTPApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, string>(
    REQUEST_OTP,
    async (email, { rejectWithValue }) => {
        try {
            const response = await requestOTPApi(email);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const verifyOTPApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, { email: string, otp: string }>(
    VERIFY_OTP,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await verifyOTPApi(payload.email, payload.otp);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const requestOtpForgetPasswordApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, string>(
    REQUEST_OTP_FORGET_PASSWORD,
    async (email, { rejectWithValue }) => {
        try {
            const response = await requestOtpForgetPasswordApi(email);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const resetPasswordApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, { email: string, newPassword: string, otp: string }>(
    RESET_PASSWORD,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await resetPasswordApi(payload.email, payload.newPassword, payload.otp);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);
