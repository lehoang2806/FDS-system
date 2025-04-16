import request from "@/services/request";

export const CreateFeedbackCampaignApi = async (params: CreateFeedbackCampaign) => {
    const data = await request.post('api/campaignfeedback/CreateFeedback', params);
    return data.data;
};