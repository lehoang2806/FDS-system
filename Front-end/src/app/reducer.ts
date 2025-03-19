import { adminStaffSlice } from '@/services/admin/staff/staffSlice';
import { authSlice } from '@/services/auth/authSlice';
import { campaignSlice } from '@/services/campaign/campaignSlice';
import { registerReceiverSlice } from '@/services/registerReceive/registerReceiverSlice';
import { userSlice } from '@/services/user/userSlide';
import { combineReducers } from '@reduxjs/toolkit';

const reducer = combineReducers({
    auth: authSlice.reducer,
    adminStaff: adminStaffSlice.reducer,
    user: userSlice.reducer,
    campaign: campaignSlice.reducer,
    registerReceiver: registerReceiverSlice.reducer
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

