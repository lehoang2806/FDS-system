import request from "@/services/request";

export const commentPostApi = async (params: CommentPost) => {
    const data = await request.post('api/forum/comment/CreateComment', params);
    return data.data;
};