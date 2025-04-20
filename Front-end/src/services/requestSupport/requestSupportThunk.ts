import { createAsyncThunk } from "@reduxjs/toolkit";
import { createRequestSupportApi, getAllRequestSupportApi, getRequestSupportByIdApi } from "./requestSupportApi";
import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";

const CREATE_REQUEST_SUPPORT = 'CREATE_REQUEST_SUPPORT';
const GET_ALL_REQUEST_SUPPORT = 'GET_ALL_REQUEST_SUPPORT';
const GET_ALL_REQUEST_SUPPORT_BY_ID = 'GET_ALL_REQUEST_SUPPORT_BY_ID';

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