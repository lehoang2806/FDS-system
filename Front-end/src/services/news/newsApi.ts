import request from "../request";

export const createNewsApi = async (params: ActionParamNews) => {
    const data = await request.post('api/news/CreateNews', params);
    return data.data;
};

export const getAllNewsApi = async () => {
    const data = await request.get('api/news/GetAllNews');
    return data.data;
}

export const getNewsByIdApi = async (newsId: string) => {
    const data = await request.get(`api/news/GetNewById/${newsId}`);
    return data.data;
}