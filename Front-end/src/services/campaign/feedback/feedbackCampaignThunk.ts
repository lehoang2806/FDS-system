import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateFeedbackCampaignApi } from "./feedbackCampaignApi";

const CREAT_FEEDBACK_CAMPAIGN = "CREATE_FEEDBACK_CAMPAIGN";

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