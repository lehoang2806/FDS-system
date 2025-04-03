import { adminStaffSlice } from '@/services/admin/staff/staffSlice';
import { appSlice } from '@/services/app/appSlice';
import { authSlice } from '@/services/auth/authSlice';
import { campaignSlice } from '@/services/campaign/campaignSlice';
import { newsSlice } from '@/services/news/newsSlice';
import { notificationSlice } from '@/services/notification/notificationSlice';
import { registerReceiverSlice } from '@/services/registerReceive/registerReceiverSlice';
import { userSlice } from '@/services/user/userSlide';
import { combineReducers } from '@reduxjs/toolkit';

const reducer = combineReducers({
    app: appSlice.reducer,
    auth: authSlice.reducer,
    adminStaff: adminStaffSlice.reducer,
    user: userSlice.reducer,
    campaign: campaignSlice.reducer,
    registerReceiver: registerReceiverSlice.reducer,
    notificate: notificationSlice.reducer,
    news: newsSlice.reducer
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

