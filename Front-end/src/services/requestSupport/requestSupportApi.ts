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

export const getAllDonorSupportApi = async () => {
    const data = await request.get('api/user/GetAllConfirmedDonorForSupport');
    return data.data;
}

export const requestDonorSupport = async (params: RequestDonor) => {
    const data = await request.post('api/RequestSupport/RequestDonorSupport', params);
    return data.data;
}

export const participateRequestSupportApi = async (requestSupportId: string, donorId: string, params: string) => {
    const data = await request.put(`api/RequestSupport/UpdateDonorStatus/${requestSupportId}/${donorId}`, params);
    return data.data;
}