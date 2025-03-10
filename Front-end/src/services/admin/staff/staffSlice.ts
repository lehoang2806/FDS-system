import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { AdminStaffState } from "@/types/user";

const initialState: AdminStaffState = {
    message: ''
};

export const adminStaffSlice = createSlice({
    name: 'adminStaff',
    initialState,
    reducers: {
    },
    extraReducers: _ => {
    },
});

export const {} = adminStaffSlice.actions;

export default adminStaffSlice.reducer;
