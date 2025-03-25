import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createNewsApi } from "./newsApi";

const CREATE_NEWS = 'CREATE_NEWS';
// const GET_ALL_CAMPAIGNS = 'GET_ALL_CAMPAIGNS';
// const GET_CURRENT_CAMPAIGN = 'GET_CURRENT_CAMPAIGN';
// const APPROVE_CAMPAIGN = 'APPROVE_CAMPAIGN';
// const REJECT_CAMPAIGN = 'REJECT_CAMPAIGN';
// const ADDITIONAL_CAMPAIGN = 'ADDITIONAL_CAMPAIGN';

export const createNewsApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, CreateNews>(
    CREATE_NEWS,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createNewsApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);