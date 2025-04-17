import request from "../request";

export const createPostApi = async (params: ActionParamPost) => {
    const data = await request.post('api/forum/CreatePost', params);
    return data.data;
};

export const getAllPostsApi = async () => {
    const data = await request.get('api/forum/GetAllPosts');
    return data.data;
};

export const getPostByIdApi = async (postId: string) => {
    const data = await request.get(`api/forum/Detail/${postId}`);
    return data.data;
}