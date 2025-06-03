import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllDonateApiThunk, getDonateByIdApiThunk } from "./donateThunk";

const initialState: DonateState = {
    donates: [],
    donate: null,
};

export const donateSlice = createSlice({
    name: "donate",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAllDonateApiThunk.fulfilled,
                (state, action: PayloadAction<Donate[]>) => {
                    state.donates = action.payload;
                }
            )
            .addCase(
                getDonateByIdApiThunk.fulfilled,
                (state, action: PayloadAction<Donate>) => {
                    state.donate = action.payload;
                }
            );
    },
});

export const {} = donateSlice.actions;

export default donateSlice.reducer;
