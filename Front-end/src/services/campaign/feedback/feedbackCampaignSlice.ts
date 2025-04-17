import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getFeedbackCampaignApiThunk } from "./feedbackCampaignThunk";

const initialState: FeedbackCampaignState = {
    listFeedbacksCampaign: []
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
    },
});

export const {} = feedbackCampaignSlice.actions;

export default feedbackCampaignSlice.reducer;