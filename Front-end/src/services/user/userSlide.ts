import { DonorCertificate, RecipientCertificate, UserInfo, UserState } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllDonorCertificateApiThunk, getAllRecipientCertificateApiThunk, getAllUserApiThunk } from "./userThunk";

const initialState: UserState = {
    listUser: [],
    listDonorCertificate: [],
    listRecipientCertificate: []
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
        .addCase(getAllRecipientCertificateApiThunk.fulfilled, (state, action: PayloadAction<RecipientCertificate[]>) => {
            state.listRecipientCertificate = action.payload;
        })
    },
});

export const {} = userSlice.actions;

export default userSlice.reducer;