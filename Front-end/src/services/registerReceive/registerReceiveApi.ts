import request from "../request";

export const createRegisterReceiverApi = async (
    params: CreateRegisterReceiver
) => {
    const data = await request.post(
        "api/RegisterReceiver/CreateRegisterReceiver",
        params
    );
    return data.data;
};

export const getAllRegisterReceiversApi = async () => {
    const data = await request.get(
        "api/RegisterReceiver/GetAllRegisterReceivers"
    );
    return data.data;
};

export const updateRegisterReceiverApi = async (registerReceiverId: string) => {
    const data = await request.put(
        `api/RegisterReceiver/UpdateStatus/${registerReceiverId}`
    );
    return data.data;
};

export const donorUpdateRegisterReceiverApi = async (
    registerReceiverId: string,
    params: { quantity: number }
) => {
    const data = await request.put(
        `api/RegisterReceiver/DonorUpdateRegisterReceiver/${registerReceiverId}`,
        params
    );
    return data.data;
};
