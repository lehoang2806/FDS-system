import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateFeedbackCampaignApi, getFeedbackCampaignApi, getFeedbackDetailApi, likeFeedbackApi, unlikeFeedbackApi } from "./feedbackCampaignApi";
import { CreateFeedbackCampaign, FeedbackCampaign, FeedbackDetail, LikeFeedback } from "@/types/campaign";

const CREAT_FEEDBACK_CAMPAIGN = "CREATE_FEEDBACK_CAMPAIGN";
const GET_FEEDBACK_CAMPAIGN = "GET_FEEDBACK_CAMPAIGN";
const GET_FEEDBACK_DETAIL = "GET_FEEDBACK_DETAIL";
const LIKE_FEEDBACK = "LIKE_FEEDBACK";
const UNLIKE_FEEDBACK = "UNLIKE_FEEDBACK";

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

export const getFeedbackDetailApiThunk = createAsyncThunk<
    FeedbackDetail,
    string
>(GET_FEEDBACK_DETAIL, async (payload, { rejectWithValue }) => {
    try {
        const response = await getFeedbackDetailApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const likeFeedbackApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    LikeFeedback
>(LIKE_FEEDBACK, async (payload, { rejectWithValue }) => {
    try {
        const response = await likeFeedbackApi(payload);
        return response;    
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const unlikeFeedbackApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    string
>(UNLIKE_FEEDBACK, async (payload, { rejectWithValue }) => {
    try {
        const response = await unlikeFeedbackApi(payload);
        return response;    
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});