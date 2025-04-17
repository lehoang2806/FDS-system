import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateFeedbackCampaignApi, getFeedbackCampaignApi } from "./feedbackCampaignApi";

const CREAT_FEEDBACK_CAMPAIGN = "CREATE_FEEDBACK_CAMPAIGN";
const GET_FEEDBACK_CAMPAIGN = "GET_FEEDBACK_CAMPAIGN";

export const createFeedbackCampaignApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    CreateFeedbackCampaign
>(CREAT_FEEDBACK_CAMPAIGN, async (payload, { rejectWithValue }) => {
    try {
        const response = await CreateFeedbackCampaignApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getFeedbackCampaignApiThunk = createAsyncThunk<
    FeedbackCampaign[],
    string
>(GET_FEEDBACK_CAMPAIGN, async (payload, { rejectWithValue }) => {
    try {
        const response = await getFeedbackCampaignApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});