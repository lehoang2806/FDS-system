import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUserApi } from "./userApi";
import { UserInfo } from "@/types/user";

const GET_ALL_USER = 'GET_ALL_USER';

export const getAllUserApiThunk = createAsyncThunk<UserInfo[]>(
    GET_ALL_USER,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllUserApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);