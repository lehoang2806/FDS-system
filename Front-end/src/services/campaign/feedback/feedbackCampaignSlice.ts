import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getFeedbackCampaignApiThunk, getFeedbackDetailApiThunk } from "./feedbackCampaignThunk";
import { FeedbackCampaign, FeedbackCampaignState, FeedbackDetail } from "@/types/campaign";

const initialState: FeedbackCampaignState = {
    listFeedbacksCampaign: [],
    feedbackDetail: null
};

export const feedbackCampaignSlice = createSlice({
    name: 'feedbackCampaign',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getFeedbackCampaignApiThunk.fulfilled, (state, action: PayloadAction<FeedbackCampaign[]>) => {
            state.listFeedbacksCampaign = action.payload;
        })
        .addCase(getFeedbackDetailApiThunk.fulfilled, (state, action: PayloadAction<FeedbackDetail>) => {
            state.feedbackDetail = action.payload;
        })
    },
});

export const {} = feedbackCampaignSlice.actions;

export default feedbackCampaignSlice.reducer;