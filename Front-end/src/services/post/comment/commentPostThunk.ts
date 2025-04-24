import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { commentPostApi, getCommentPostApi } from "./commentPostApi";

const COMMENT_POST = "COMMENT_POST";
const GET_COMMENT_POST = "GET_COMMENT_POST";

export const commentPostApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    CommentPost
>(COMMENT_POST, async (payload, { rejectWithValue }) => {
    try {
        const response = await commentPostApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getCommentPostApiThunk = createAsyncThunk<
    PostCommentDto[],
    string
>(GET_COMMENT_POST, async (payload, { rejectWithValue }) => {
    try {
        const response = await getCommentPostApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});