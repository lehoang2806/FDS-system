import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDonateApi, getDonateByIdApi } from "./donateApi";

const GET_ALL_DONATE = "GET_ALL_DONATE";
const GET_DONATE_BY_ID = "GET_DONATE_BY_ID";

export const getAllDonateApiThunk = createAsyncThunk<Donate[]>(
    GET_ALL_DONATE,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllDonateApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const getDonateByIdApiThunk = createAsyncThunk<Donate, string>(
    GET_DONATE_BY_ID,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getDonateByIdApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);
