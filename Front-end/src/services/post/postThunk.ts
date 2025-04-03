import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPostApi } from "./postApi";

const CREATE_POST = 'CREATE_POST';

export const createPostApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, ActionParamPost>(
    CREATE_POST,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createPostApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);