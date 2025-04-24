import request from "@/services/request";

export const commentPostApi = async (params: CommentPost) => {
    const data = await request.post('api/forum/comment/CreateComment', params);
    return data.data;
};

export const getCommentPostApi = async (postId: string) => {
    const data = await request.get(`api/forum/comment/GetCommentsByPost/${postId}`);
    return data.data;
};