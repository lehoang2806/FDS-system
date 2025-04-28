import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllDonorSupportApiThunk, getAllRequestSupportApiThunk, getRequestSupportByIdApiThunk } from "./requestSupportThunk";

const initialState: RequestSupportState = {
    listRequestSupport: [],
    requestSupport: null,
    listDonorSupport: []
};

export const requestSupportSlice = createSlice({
    name: 'requestSupport',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllRequestSupportApiThunk.fulfilled, (state, action: PayloadAction<RequestSupportInfo[]>) => {
            state.listRequestSupport = action.payload;
        })
        .addCase(getRequestSupportByIdApiThunk.fulfilled, (state, action: PayloadAction<RequestSupportInfo>) => {
            state.requestSupport = action.payload;
        })
        .addCase(getAllDonorSupportApiThunk.fulfilled, (state, action: PayloadAction<DonorSupport[]>) => {
            state.listDonorSupport = action.payload;
        })
    },
});

export const {} = requestSupportSlice.actions;

export default requestSupportSlice.reducer;