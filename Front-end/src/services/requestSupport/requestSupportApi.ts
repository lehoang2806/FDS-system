import request from "../request";

export const createRequestSupportApi = async (params: RequestSupportActions) => {
    const data = await request.post('api/RequestSupport/CreateRequestSupport', params);
    return data.data;
}

export const getAllRequestSupportApi = async () => {
    const data = await request.get('api/RequestSupport/GetAllRequestSupport');
    return data.data;
}

export const getRequestSupportByIdApi = async (requestSupportId: string) => {
    const data = await request.get(`api/RequestSupport/GetRequestSupportById/${requestSupportId}`);
    return data.data;
}