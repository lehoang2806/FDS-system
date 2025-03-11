import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCampaignApi, getAllCampaignApi } from "./campaignApi";
import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";

const ADD_CAMPAIGN = 'ADD_CAMPAIGN';
const GET_ALL_CAMPAIGNS = 'GET_ALL_CAMPAIGNS';

export const addCampaignApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, AddCampaign>(
    ADD_CAMPAIGN,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await addCampaignApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllCampaignApiThunk = createAsyncThunk<CampaignInfo[]>(
    GET_ALL_CAMPAIGNS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllCampaignApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);