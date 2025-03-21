import { createAsyncThunk } from "@reduxjs/toolkit";
import { approveCertificateApi, confirmUserApi, createOrganizationDonorCertificateApi, createPersonalDonorCertificateApi, createRecipientCertificateApi, getAllDonorCertificateApi, getAllRecipientCertificateApi, getAllUserApi, rejectCertificateApi } from "./userApi";
import { AddRecipientCertificate, ApproveCertificate, ConfirmUser, DonorCertificate, OrganizationDonor, PersonalDonor, RecipientCertificate, RejectCertificate, UserInfo } from "@/types/user";
import { TextResponse } from "@/types/auth";
import { ResponseFromServer } from "@/types/app";

const GET_ALL_USER = 'GET_ALL_USER';
const CREATE_PERSONAL_DONOR_CERTIFICATE = 'CREATE_PERSONAL_DONOR_CERTIFICATE';
const CREATE_ORGANIZATION_DONOR_CERTIFICATE = 'CREATE_ORGANIZATION_DONOR_CERTIFICATE';
const GET_ALL_DONOR_CERTIFICATE = 'GET_ALL_DONOR_CERTIFICATE';
const APPROVE_CERTIFICATE = 'APPROVE_CERTIFICATE';
const REJECT_CERTIFICATE = 'REJECT_CERTIFICATE';
const CONFIRM_USER = 'CONFIRM_USER';
const CREATE_RECIPIENT_CERTIFICATE = 'CREATE_RECIPIENT_CERTIFICATE';
const GET_ALL_RECIPIENT_CERTIFICATE = 'GET_ALL_RECIPIENT_CERTIFICATE';

export const getAllUserApiThunk = createAsyncThunk<UserInfo[]>(
    GET_ALL_USER,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllUserApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const createPersonalDonorCertificateApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, PersonalDonor>(
    CREATE_PERSONAL_DONOR_CERTIFICATE,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createPersonalDonorCertificateApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const createOrganizationDonorCertificateApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, OrganizationDonor>(
    CREATE_ORGANIZATION_DONOR_CERTIFICATE,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createOrganizationDonorCertificateApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllDonorCertificateApiThunk = createAsyncThunk<DonorCertificate[]>(
    GET_ALL_DONOR_CERTIFICATE,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllDonorCertificateApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const approveCertificateApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, ApproveCertificate>(
    APPROVE_CERTIFICATE,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await approveCertificateApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const rejectCertificateApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, RejectCertificate>(
    REJECT_CERTIFICATE,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await rejectCertificateApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const confirmUserApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, ConfirmUser>(
    CONFIRM_USER,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await confirmUserApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const createRecipientCertificateApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, AddRecipientCertificate>(
    CREATE_RECIPIENT_CERTIFICATE,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createRecipientCertificateApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllRecipientCertificateApiThunk = createAsyncThunk<RecipientCertificate[]>(
    GET_ALL_RECIPIENT_CERTIFICATE,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllRecipientCertificateApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);