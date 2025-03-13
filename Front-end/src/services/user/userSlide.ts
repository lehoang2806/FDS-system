import { DonorCertificate, UserInfo, UserState } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllDonorCertificateApiThunk, getAllUserApiThunk } from "./userThunk";

const initialState: UserState = {
    listUser: [],
    listDonorCertificate: []
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllUserApiThunk.fulfilled, (state, action: PayloadAction<UserInfo[]>) => {
            state.listUser = action.payload;
        })
        .addCase(getAllDonorCertificateApiThunk.fulfilled, (state, action: PayloadAction<DonorCertificate[]>) => {
            state.listDonorCertificate = action.payload;
        })
    },
});

export const {} = userSlice.actions;

export default userSlice.reducer;