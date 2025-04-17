import request from "@/services/request";

export const CreateFeedbackCampaignApi = async (params: CreateFeedbackCampaign) => {
    const data = await request.post('api/campaignfeedback/CreateFeedback', params);
    return data.data;
};

export const getFeedbackCampaignApi = async (campaignId: string) => {
    const data = await request.get(`api/campaignfeedback/GetFeedBack/${campaignId}`);
    return data.data;
};

export const getFeedbackDetailApi = async (feedbackId: string) => {
    const data = await request.get(`api/campaignfeedback/Detail/${feedbackId}`);
    return data.data;
}

export const likeFeedbackApi = async (feedbackId: string) => {
    const data = await request.post(`api/feedbacklike/like/${feedbackId}`);
    return data.data;
}

export const unlikeFeedbackApi = async (feedbackId: string) => {
    const data = await request.delete(`api/feedbacklike/unlike/${feedbackId}`);
    return data.data;
}