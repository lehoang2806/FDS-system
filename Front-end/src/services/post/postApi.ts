import request from "../request";

export const createPostApi = async (params: ActionParamPost) => {
    const data = await request.post('api/forum/CreatePost', params);
    return data.data;
};