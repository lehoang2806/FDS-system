import { ResponseFromServer } from "@/types/app";
import { TextResponse } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createRegisterReceiverApi,
    donorUpdateRegisterReceiverApi,
    getAllRegisterReceiversApi,
    updateActualQuantityApi,
    updateRegisterReceiverApi,
} from "./registerReceiveApi";

const CREATE_REGISTER_RECEIVER = "CREATE_REGISTER_RECEIVER";
const GET_ALL_REGISTER_RECEIVERS = "GET_ALL_REGISTER_RECEIVERS";
const UPDATE_REGISTER_RECEIVER = "UPDATE_REGISTER_RECEIVER";
const DONOR_UPDATE_REGISTER_RECEIVER = "DONOR_UPDATE_REGISTER_RECEIVER";
const UPDATE_ACTUAL_QUANTITY = "UPDATE_ACTUAL_QUANTITY";

export const createRegisterReceiverApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    CreateRegisterReceiver
>(CREATE_REGISTER_RECEIVER, async (payload, { rejectWithValue }) => {
    try {
        const response = await createRegisterReceiverApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllRegisterReceiversApiThunk = createAsyncThunk<
    RegisterReceiver[]
>(GET_ALL_REGISTER_RECEIVERS, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllRegisterReceiversApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const updateRegisterReceiverApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    string
>(UPDATE_REGISTER_RECEIVER, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateRegisterReceiverApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const donorUpdateRegisterReceiverApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>, // Kiểu trả về
    { id: string; params: { quantity: number } } // Kiểu input payload
>(
    DONOR_UPDATE_REGISTER_RECEIVER, // Tên action
    async (payload, { rejectWithValue }) => {
        try {
            const response = await donorUpdateRegisterReceiverApi(
                payload.id,
                payload.params
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response?.data,
            });
        }
    }
);

export const updateActualQuantityApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>, // Kiểu trả về
    UpdateActualQuantity
>(
    UPDATE_ACTUAL_QUANTITY, // Tên action
    async (payload, { rejectWithValue }) => {
        try {
            const response = await updateActualQuantityApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response?.data,
            });
        }
    }
);
