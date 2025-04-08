import { createAsyncThunk } from "@reduxjs/toolkit";
import { readNotificationApi } from "./notificationApi";

const READ_NOTIFICATION = "READ_NOTIFICATION";

export const readNotificationApiThunk = createAsyncThunk<
    NotificationDto,
    string
>(READ_NOTIFICATION, async (notificationId, { rejectWithValue }) => {
    try {
        const response = await readNotificationApi(notificationId);
        return response.data; // Trả về dữ liệu từ API
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
