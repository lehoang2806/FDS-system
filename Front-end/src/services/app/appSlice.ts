import { AppGlobalState } from "@/types/app";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

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
    extraReducers: _ => {},
});

export const { setLoading } = appSlice.actions;

export default appSlice.reducer;
