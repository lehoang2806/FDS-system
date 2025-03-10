import { ResponseFromServer } from "@/types/app";
import { AuthResponse} from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addStaffApi } from "./staffApi";
import { AddStaff } from "@/types/user";

const ADD_STAFF = 'ADD_STAFF';

export const addStaffApiThunk = createAsyncThunk<ResponseFromServer<AuthResponse>, AddStaff>(
    ADD_STAFF,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await addStaffApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);
