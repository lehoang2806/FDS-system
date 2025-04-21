import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllRequestSupportApiThunk, getRequestSupportByIdApiThunk } from "./requestSupportThunk";

const initialState: RequestSupportState = {
    listRequestSupport: [],
    requestSupport: null
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
    },
});

export const {} = requestSupportSlice.actions;

export default requestSupportSlice.reducer;