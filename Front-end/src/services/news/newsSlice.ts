import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllNewsApiThunk, getNewsByIdApiThunk } from "./newsThunk";

const initialState: NewsState = {
    listNews: [],
    currentNews: null,
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
        .addCase(getNewsByIdApiThunk.fulfilled, (state, action: PayloadAction<NewsInfo>) => {
            state.currentNews = action.payload;
        })
    },
});

export const {} = newsSlice.actions;

export default newsSlice.reducer;