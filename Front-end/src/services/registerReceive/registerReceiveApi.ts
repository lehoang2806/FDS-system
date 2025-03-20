import request from "../request";

export const createRegisterReceiverApi = async (params: CreateRegisterReceiver) => {
    const data = await request.post('api/RegisterReceiver/CreateRegisterReceiver', params);
    return data.data;
}

export const getAllRegisterReceiversApi = async () => {
    const data = await request.get('api/RegisterReceiver/GetAllRegisterReceivers');
    return data.data;
}