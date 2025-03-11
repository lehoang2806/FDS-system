import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllCampaignApiThunk } from "./campaignThunk";

const initialState: CampaignState = {
    listCampaigns: []
};

export const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllCampaignApiThunk.fulfilled, (state, action: PayloadAction<CampaignInfo[]>) => {
            state.listCampaigns = action.payload;
        })
    },
});

export const {} = campaignSlice.actions;

export default campaignSlice.reducer;