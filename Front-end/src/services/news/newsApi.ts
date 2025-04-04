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

export const createNewsCommentApi = async (params: ActionParamNewsComment) => {
    const data = await request.post('api/News/comment/CreateComment', params);
    return data.data;
}

export const interestNewsApi = async (newsId: string) => {
    const data = await request.post(`api/NewOfInterest/NewOfInterest/${newsId}`);
    return data.data;
}