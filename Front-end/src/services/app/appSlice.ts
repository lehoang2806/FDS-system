import { AppGlobalState } from "@/types/app";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AppGlobalState = {
    loading: false
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: builder => {},
});

export const { setLoading } = appSlice.actions;

export default appSlice.reducer;
