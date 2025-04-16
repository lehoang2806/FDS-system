import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllPostsApiThunk } from "./postThunk";

const initialState: PostState = {
    listPosts: []
};

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
        .addCase(getAllPostsApiThunk.fulfilled, (state, action: PayloadAction<Post[]>) => {
            state.listPosts = action.payload;
        })
    },
});

export const {} = postSlice.actions;

export default postSlice.reducer;