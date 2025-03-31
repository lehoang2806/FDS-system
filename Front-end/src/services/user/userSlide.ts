import { currentOrganizationDonorCertificate, currentPersonalDonorCertificate, currentRecipientCertificate, DonorCertificate, RecipientCertificate, UserInfo, UserState } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllDonorCertificateApiThunk, getAllRecipientCertificateApiThunk, getAllUserApiThunk, getOrganizationDonorCertificateByIdApiThunk, getPersonalDonorCertificateByIdApiThunk, getProfileApiThunk, getRecipientCertificateByIdApiThunk } from "./userThunk";

const initialState: UserState = {
    listUser: [],
    profileUser: null,
    listDonorCertificate: [],
    listRecipientCertificate: [],
    currentDonorOrganizationCertificate: null,
    currentDonorPersonalCertificate: null,
    currentRecipientCertificate: null
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
        .addCase(getProfileApiThunk.fulfilled, (state, action: PayloadAction<UserInfo>) => {
            state.profileUser = action.payload;
        })
        .addCase(getAllDonorCertificateApiThunk.fulfilled, (state, action: PayloadAction<DonorCertificate[]>) => {
            state.listDonorCertificate = action.payload;
        })
        .addCase(getAllRecipientCertificateApiThunk.fulfilled, (state, action: PayloadAction<RecipientCertificate[]>) => {
            state.listRecipientCertificate = action.payload;
        })
        .addCase(getPersonalDonorCertificateByIdApiThunk.fulfilled, (state, action: PayloadAction<currentPersonalDonorCertificate>) => {
            state.currentDonorPersonalCertificate = action.payload;
        })
        .addCase(getOrganizationDonorCertificateByIdApiThunk.fulfilled, (state, action: PayloadAction<currentOrganizationDonorCertificate>) => {
            state.currentDonorOrganizationCertificate = action.payload;
        })
        .addCase(getRecipientCertificateByIdApiThunk.fulfilled, (state, action: PayloadAction<currentRecipientCertificate>) => {
            state.currentRecipientCertificate = action.payload;
        })
    },
});

export const {} = userSlice.actions;

export default userSlice.reducer;