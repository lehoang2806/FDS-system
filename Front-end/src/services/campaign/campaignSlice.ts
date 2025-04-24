import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllCampaignApiThunk, getCampaignByIdApiThunk } from "./campaignThunk";
import { CampaignInfo, CampaignState, CurrentCampaign } from "@/types/campaign";

const initialState: CampaignState = {
    listCampaigns: [],
    currentCampaign: null
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
        .addCase(getCampaignByIdApiThunk.fulfilled, (state, action: PayloadAction<CurrentCampaign>) => {
            state.currentCampaign = action.payload;
        })
    },
});

export const {} = campaignSlice.actions;

export default campaignSlice.reducer;