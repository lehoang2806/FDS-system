import request from "@/services/request";
import { CreateFeedbackCampaign, LikeFeedback } from "@/types/campaign";

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

export const likeFeedbackApi = async (params: LikeFeedback) => {
    const data = await request.post(`api/feedbacklike/like`, params);
    return data.data;
}

export const unlikeFeedbackApi = async (feedbackLikeId: string) => {
    const data = await request.delete(`api/feedbacklike/unlike/${feedbackLikeId}`);
    return data.data;
}