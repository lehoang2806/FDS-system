import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    commentPostApi,
    getCommentPostApi,
    likeCommentApi,
    unlikeCommentApi,
} from "./commentPostApi";

const COMMENT_POST = "COMMENT_POST";
const GET_COMMENT_POST = "GET_COMMENT_POST";
const LIKE_COMMENT = "LIKE_COMMENT";
const UNLIKE_COMMENT = "UNLIKE_COMMENT";

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

export const likeCommentApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    LikeComment
>(LIKE_COMMENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await likeCommentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const unlikeCommentApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    string
>(UNLIKE_COMMENT, async (payload, { rejectWithValue }) => {
    try {
        const response = await unlikeCommentApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
