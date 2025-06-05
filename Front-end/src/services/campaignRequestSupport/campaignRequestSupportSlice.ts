import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    CampaignRequestSupport,
    CampaignRequestSupportState,
} from "@/types/campaignRequestSupport";
import {
    getAllCampaignRequestSupportApiThunk,
    getCampaignRequestSupportByIdApiThunk,
} from "./campaignRequestSupportThunk";

const initialState: CampaignRequestSupportState = {
    listCampaignsRequestSupport: [],
    campaignRequestSupportDetail: null,
};

export const campaignRequestSupportSlice = createSlice({
    name: "campaignRequestSupport",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllCampaignRequestSupportApiThunk.fulfilled,
                (state, action: PayloadAction<CampaignRequestSupport[]>) => {
                    state.listCampaignsRequestSupport = action.payload;
                }
            )
            .addCase(
                getCampaignRequestSupportByIdApiThunk.fulfilled,
                (state, action: PayloadAction<CampaignRequestSupport>) => {
                    state.campaignRequestSupportDetail = action.payload;
                }
            );
    },
});

export const {} = campaignRequestSupportSlice.actions;

export default campaignRequestSupportSlice.reducer;
