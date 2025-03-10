import { adminStaffSlice } from '@/services/admin/staff/staffSlice';
import { authSlice } from '@/services/auth/authSlice';
import { combineReducers } from '@reduxjs/toolkit';

const reducer = combineReducers({
    auth: authSlice.reducer,
    adminStaff: adminStaffSlice.reducer
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

