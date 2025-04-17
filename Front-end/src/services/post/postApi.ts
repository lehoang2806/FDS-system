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

export const approvePostApi = async (params: ApprovePost) => {
    const data = await request.put('api/forum/Approve', params);
    return data.data;
}

export const rejectPostApi = async (params: RejectPost) => {
    const data = await request.put('api/forum/Reject', params);
    return data.data;
}

export const likePostApi = async (postId: string) => {
    const data = await request.post(`api/postlike/like/${postId}`);
    return data.data;
}

export const unlikePostApi = async (postId: string) => {
    const data = await request.delete(`api/postlike/unlike/${postId}`);
    return data.data;
}