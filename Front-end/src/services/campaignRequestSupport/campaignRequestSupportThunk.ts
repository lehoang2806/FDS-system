import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    additionalCampaignRequestSupportApi,
    approveCampaignRequestSupportApi,
    CancelCampaignRequestSupportApi,
    createCampaignRequestSupportApi,
    deleteCampaignRequestSupportApi,
    getAllCampaignsRequestSupportApi,
    getCampaignRequestSupportByIdApi,
    rejectCampaignRequestSupportApi,
    updateCampaignRequestSupportApi,
} from "./campaignRequestSupportApi";
import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import {
    AdditionalCampaignRequestSupport,
    ApproveCampaignRequestSupport,
    CampaignRequestSupport,
    CampaignRequestSupportActionsParams,
    CancelCampaignRequestSupport,
    RejectCampaignRequestSupport,
} from "@/types/campaignRequestSupport";

const CREATE_CAMPAIGN_REQUEST_SUPPORT = "CREATE_CAMPAIGN_REQUEST_SUPPORT";
const GET_ALL_CAMPAIGN_REQUEST_SUPPORT = "GET_ALL_CAMPAIGN_REQUEST_SUPPORT";
const GET_CAMPAIGN_REQUEST_SUPPORT_BY_ID = "GET_CAMPAIGN_REQUEST_SUPPORT_BY_ID";
const UPDATE_CAMPAIGN_REQUEST_SUPPORT = "UPDATE_CAMPAIGN_REQUEST_SUPPORT";
const DETELE_CAMPAIGN_REQUEST_SUPPORT = "DETELE_CAMPAIGN_REQUEST_SUPPORT";
const APPROVE_CAMPAIGN_REQUEST_SUPPORT = "APPROVE_CAMPAIGN_REQUEST_SUPPORT";
const REJECT_CAMPAIGN_REQUEST_SUPPORT = "REJECT_CAMPAIGN_REQUEST_SUPPORT";
const CANCEL_CAMPAIGN_REQUEST_SUPPORT = "CANCEL_CAMPAIGN_REQUEST_SUPPORT";
const ADDITIONAL_CAMPAIGN_REQUEST_SUPPORT =
    "ADDITIONAL_CAMPAIGN_REQUEST_SUPPORT";

export const createCampaignRequestSupportApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    CampaignRequestSupportActionsParams
>(CREATE_CAMPAIGN_REQUEST_SUPPORT, async (payload, { rejectWithValue }) => {
    try {
        const response = await createCampaignRequestSupportApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllCampaignRequestSupportApiThunk = createAsyncThunk<
    CampaignRequestSupport[]
>(GET_ALL_CAMPAIGN_REQUEST_SUPPORT, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllCampaignsRequestSupportApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getCampaignRequestSupportByIdApiThunk = createAsyncThunk<
    CampaignRequestSupport,
    string
>(GET_CAMPAIGN_REQUEST_SUPPORT_BY_ID, async (payload, { rejectWithValue }) => {
    try {
        const response = await getCampaignRequestSupportByIdApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const updateCampaignRequestSupportApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    { id: string; params: CampaignRequestSupportActionsParams }
>(
    UPDATE_CAMPAIGN_REQUEST_SUPPORT,
    async ({ id, params }, { rejectWithValue }) => {
        try {
            const response = await updateCampaignRequestSupportApi(id, params);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const deleteCampaignRequestSupportApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    string
>(DETELE_CAMPAIGN_REQUEST_SUPPORT, async (payload, { rejectWithValue }) => {
    try {
        const response = await deleteCampaignRequestSupportApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const approveCampaignRequestSupportApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    ApproveCampaignRequestSupport
>(APPROVE_CAMPAIGN_REQUEST_SUPPORT, async (payload, { rejectWithValue }) => {
    try {
        const response = await approveCampaignRequestSupportApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const rejectCampaignRequestSupportApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    RejectCampaignRequestSupport
>(REJECT_CAMPAIGN_REQUEST_SUPPORT, async (payload, { rejectWithValue }) => {
    try {
        const response = await rejectCampaignRequestSupportApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const additionalCampaignRequestSupportApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    AdditionalCampaignRequestSupport
>(ADDITIONAL_CAMPAIGN_REQUEST_SUPPORT, async (payload, { rejectWithValue }) => {
    try {
        const response = await additionalCampaignRequestSupportApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const cancelCampaignRequestSupportApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    CancelCampaignRequestSupport
>(CANCEL_CAMPAIGN_REQUEST_SUPPORT, async (payload, { rejectWithValue }) => {
    try {
        const response = await CancelCampaignRequestSupportApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
