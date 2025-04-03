import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllNewsApiThunk } from "./newsThunk";

const initialState: NewsState = {
    listNews: [],
};

export const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllNewsApiThunk.fulfilled, (state, action: PayloadAction<NewsInfo[]>) => {
            state.listNews = action.payload;
        })
    },
});

export const {} = newsSlice.actions;

export default newsSlice.reducer;