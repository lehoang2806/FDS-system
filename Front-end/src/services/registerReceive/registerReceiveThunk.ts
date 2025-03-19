import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createRegisterReceiverApi, getAllRegisterReceiversApi } from "./registerReceiveApi";

const CREATE_REGISTER_RECEIVER = "CREATE_REGISTER_RECEIVER";
const GET_ALL_REGISTER_RECEIVERS = "GET_ALL_REGISTER_RECEIVERS";

export const createRegisterReceiverApiThunk = createAsyncThunk<ResponseFromServer<TextResponse>, CreateRegisterReceiver>(
    CREATE_REGISTER_RECEIVER,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createRegisterReceiverApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);

export const getAllRegisterReceiversApiThunk = createAsyncThunk<RegisterReceiver[]>(
    GET_ALL_REGISTER_RECEIVERS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllRegisterReceiversApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    },
);