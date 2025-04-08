import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { readNotificationApiThunk } from "./notificationThunk";

const initialState: NotificationState = {
    notifications: [],
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<NotificationDto[]>) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action: PayloadAction<NotificationDto>) => {
            state.notifications.unshift(action.payload); // Thêm notification mới vào đầu
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            readNotificationApiThunk.fulfilled,
            (state, action: PayloadAction<NotificationDto>) => {
                if (!action.payload || !action.payload.notificationId) {
                    return;
                }

                const notificationId = action.payload.notificationId;
                const notificationIndex = state.notifications.findIndex(
                    (notif) => notif.notificationId === notificationId
                );
                if (notificationIndex !== -1) {
                    state.notifications[notificationIndex] = {
                        ...state.notifications[notificationIndex],
                        isRead: true,
                    };
                }
            }
        );
    },
});

export const { setNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
