import request from "../request";

export const createNewsApi = async (params: ActionParamNews) => {
    const data = await request.post('api/news/CreateNews', params);
    return data.data;
};

export const updateNewsApi = async (newsId: string,params: ActionParamNews) => {
    const data = await request.put(`api/news/UpdateNews/${newsId}`, params);
    return data.data;
};

export const deleteNewsApi = async (newsId: string) => {
    const data = await request.delete(`api/news/DeleteNews/${newsId}`);
    return data.data;
}

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