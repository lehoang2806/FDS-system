import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCampaignApi, additionalCampaignApi, approveCampaignApi, getAllCampaignApi, getCampaignByIdApi, rejectCampaignApi } from "./campaignApi";
import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";

const ADD_CAMPAIGN = 'ADD_CAMPAIGN';
const GET_ALL_CAMPAIGNS = 'GET_ALL_CAMPAIGNS';
const GET_CURRENT_CAMPAIGN = 'GET_CURRENT_CAMPAIGN';
const APPROVE_CAMPAIGN = 'APPROVE_CAMPAIGN';
const REJECT_CAMPAIGN = 'REJECT_CAMPAIGN';
const ADDITIONAL_CAMPAIGN = 'ADDITIONAL_CAMPAIGN';

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

export const getCampaignByIdApiThunk = createAsyncThunk<CurrentCampaign, string>(
    GET_CURRENT_CAMPAIGN,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getCampaignByIdApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const approveCampaignApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, ApproveCampaign>(
    APPROVE_CAMPAIGN,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await approveCampaignApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const rejectCampaignApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, RejectCampaign>(
    REJECT_CAMPAIGN,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await rejectCampaignApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const additionalCampaignApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, AdditionalCampaign>(
    ADDITIONAL_CAMPAIGN,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await additionalCampaignApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);