import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { approvePostApi, createPostApi, getAllPostsApi, getPostByIdApi, likePostApi, rejectPostApi, unlikePostApi } from "./postApi";

const CREATE_POST = "CREATE_POST";
const GET_ALL_POST = "GET_ALL_POST";
const GET_POST_BY_ID = "GET_POST_BY_ID";
const APPROVE_POST = "APPROVE_POST";
const REJECT_POST = "REJECT_POST";
const LIKE_POST = "LIKE_POST";
const UNLIKE_POST = "UNLIKE_POST";

export const createPostApiThunk = createAsyncThunk<
    PostInfo,
    ActionParamPost
>(CREATE_POST, async (payload, { rejectWithValue }) => {
    try {
        const response = await createPostApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllPostsApiThunk = createAsyncThunk<Post[]>(
    GET_ALL_POST,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllPostsApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const getPostByIdApiThunk = createAsyncThunk<PostInfo, string>(
    GET_POST_BY_ID,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getPostByIdApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const approvePostApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    ApprovePost
>(APPROVE_POST, async (payload, { rejectWithValue }) => {
    try {
        const response = await approvePostApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const rejectPostApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    RejectPost
>(REJECT_POST, async (payload, { rejectWithValue }) => {
    try {
        const response = await rejectPostApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const likePostApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    string
>(LIKE_POST, async (payload, { rejectWithValue }) => {
    try {
        const response = await likePostApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const unlikePostApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    string
>(UNLIKE_POST, async (payload, { rejectWithValue }) => {
    try {
        const response = await unlikePostApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
