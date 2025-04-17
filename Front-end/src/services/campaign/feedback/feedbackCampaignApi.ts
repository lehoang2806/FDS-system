import request from "@/services/request";

export const CreateFeedbackCampaignApi = async (params: CreateFeedbackCampaign) => {
    const data = await request.post('api/campaignfeedback/CreateFeedback', params);
    return data.data;
};

export const getFeedbackCampaignApi = async (campaignId: string) => {
    const data = await request.get(`api/campaignfeedback/GetFeedBack/${campaignId}`);
    return data.data;
};