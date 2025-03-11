import { adminStaffSlice } from '@/services/admin/staff/staffSlice';
import { authSlice } from '@/services/auth/authSlice';
import { userSlice } from '@/services/user/userSlide';
import { combineReducers } from '@reduxjs/toolkit';

const reducer = combineReducers({
    auth: authSlice.reducer,
    adminStaff: adminStaffSlice.reducer,
    user: userSlice.reducer
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

