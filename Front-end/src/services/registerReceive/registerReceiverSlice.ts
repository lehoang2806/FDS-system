import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllRegisterReceiversApiThunk } from "./registerReceiveThunk";

const initialState: RegisterReceiverState = {
    listRegisterReceivers: []
};

export const registerReceiverSlice = createSlice({
    name: 'registerReceiver',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllRegisterReceiversApiThunk.fulfilled, (state, action: PayloadAction<RegisterReceiver[]>) => {
            state.listRegisterReceivers = action.payload;
        })
    },
});

export const {} = registerReceiverSlice.actions;

export default registerReceiverSlice.reducer;