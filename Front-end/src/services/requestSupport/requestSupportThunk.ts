import { createAsyncThunk } from "@reduxjs/toolkit";
import { createRequestSupportApi, getAllDonorSupportApi, getAllRequestSupportApi, getRequestSupportByIdApi, participateRequestSupportApi, requestDonorSupport } from "./requestSupportApi";
import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";

const CREATE_REQUEST_SUPPORT = 'CREATE_REQUEST_SUPPORT';
const GET_ALL_REQUEST_SUPPORT = 'GET_ALL_REQUEST_SUPPORT';
const GET_ALL_REQUEST_SUPPORT_BY_ID = 'GET_ALL_REQUEST_SUPPORT_BY_ID';
const GET_DONOR_SUPPORT = 'GET_DONOR_SUPPORT';
const REQUEST_DONOR_SUPPORT = 'REQUEST_DONOR_SUPPORT';
const PARTICIPATE_REQUEST_SUPPORT = 'PARTICIPATE_REQUEST_SUPPORT';

export const createRequestSupportApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, RequestSupportActions>(
    CREATE_REQUEST_SUPPORT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createRequestSupportApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllRequestSupportApiThunk = createAsyncThunk(
    GET_ALL_REQUEST_SUPPORT,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllRequestSupportApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getRequestSupportByIdApiThunk = createAsyncThunk<RequestSupportInfo, string>(
    GET_ALL_REQUEST_SUPPORT_BY_ID,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getRequestSupportByIdApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllDonorSupportApiThunk = createAsyncThunk(
    GET_DONOR_SUPPORT,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllDonorSupportApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const requestDonorSupportApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, RequestDonor>(
    REQUEST_DONOR_SUPPORT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await requestDonorSupport(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const participateRequestSupportApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, { requestSupportId: string, donorId: string, params: string}>(
    PARTICIPATE_REQUEST_SUPPORT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await participateRequestSupportApi(payload.requestSupportId, payload.donorId, payload.params);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);