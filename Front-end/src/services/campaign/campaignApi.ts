import request from "../request";

export const addCampaignApi = async (params: AddCampaign) => {
    const data = await request.post('api/campaign/CreateCampaign', params);
    return data.data;
};

export const getAllCampaignApi = async () => {
    const data = await request.get('api/campaign/GetAllCampaigns');
    return data.data;
};