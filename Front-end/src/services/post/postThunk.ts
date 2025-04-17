import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPostApi, getAllPostsApi, getPostByIdApi } from "./postApi";

const CREATE_POST = "CREATE_POST";
const GET_ALL_POST = "GET_ALL_POST";
const GET_POST_BY_ID = "GET_POST_BY_ID";

export const createPostApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
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
