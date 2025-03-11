import { UserInfo, UserState } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllUserApiThunk } from "./userThunk";

const initialState: UserState = {
    listUser: []
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllUserApiThunk.fulfilled, (state, action: PayloadAction<UserInfo[]>) => {
            state.listUser = action.payload;
        })
    },
});

export const {} = userSlice.actions;

export default userSlice.reducer;