import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllDonateApiThunk } from "./donateThunk";

const initialState: DonateState = {
    donates: [],
};

export const donateSlice = createSlice({
    name: 'donate',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllDonateApiThunk.fulfilled, (state, action: PayloadAction<Donate[]>) => {
            state.donates = action.payload;
        })
    },
});

export const {} = donateSlice.actions;

export default donateSlice.reducer;