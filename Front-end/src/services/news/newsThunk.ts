import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createNewsApi, createNewsCommentApi, getAllNewsApi, getNewsByIdApi, interestNewsApi } from "./newsApi";

const CREATE_NEWS = 'CREATE_NEWS';
const GET_ALL_NEWS = 'GET_ALL_NEWS';
const GET_NEWS_BY_ID = 'GET_NEWS_BY_ID';
const CREATE_NEWS_COMMENT = 'CREATE_NEWS_COMMENT';
const INTEREST_NEWS = "INTEREST_NEWS"

export const createNewsApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, ActionParamNews>(
    CREATE_NEWS,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createNewsApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllNewsApiThunk = createAsyncThunk<NewsInfo[]>(
    GET_ALL_NEWS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllNewsApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const getNewsByIdApiThunk = createAsyncThunk<NewsInfo, string>(
    GET_NEWS_BY_ID,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getNewsByIdApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const createNewsCommentApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, ActionParamNewsComment>(
    CREATE_NEWS_COMMENT,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createNewsCommentApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const interestNewsApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, string>(
    INTEREST_NEWS,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await interestNewsApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
)