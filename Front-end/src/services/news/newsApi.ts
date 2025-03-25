import request from "../request";

export const createNewsApi = async (params: CreateNews) => {
    const data = await request.post('api/news/CreateNews', params);
    return data.data;
};