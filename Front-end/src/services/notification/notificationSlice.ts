import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
            state.notifications.unshift(action.payload);
        },
        markNotificationAsRead: (state, action: PayloadAction<number>) => {
            state.notifications[action.payload].isRead = true;
        },
    },
});

export const { setNotifications, addNotification, markNotificationAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
