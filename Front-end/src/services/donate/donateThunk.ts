import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDonateApi } from "./donateApi";

const GET_ALL_DONATE = "GET_ALL_DONATE";

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
