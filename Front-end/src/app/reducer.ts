import { authSlice } from '@/services/auth/authSlice';
import { combineReducers } from '@reduxjs/toolkit';

const reducer = combineReducers({
    auth: authSlice.reducer,
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;

