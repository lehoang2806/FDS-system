import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllPostsApiThunk, getPostByIdApiThunk } from "./postThunk";

const initialState: PostState = {
    listPosts: [],
    post: null
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
        .addCase(getPostByIdApiThunk.fulfilled, (state, action: PayloadAction<PostInfo>) => {
            state.post = action.payload;
        })
    },
});

export const {} = postSlice.actions;

export default postSlice.reducer;