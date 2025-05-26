import { AddCampaign, AdditionalCampaign, ApproveCampaign, CancelCampaign, RejectCampaign, UpdateCampaign } from "@/types/campaign";
import request from "../request";

export const addCampaignApi = async (params: AddCampaign) => {
    const data = await request.post('api/campaign/CreateCampaign', params);
    return data.data;
};

export const updateCampaignApi = async (params: UpdateCampaign, campaignId: string) => {
    const data = await request.put(`api/campaign/UpdateCampaign/${campaignId}`, params);
    return data.data;
};

export const deleteCampaignApi = async (id: string) => {
    const data = await request.delete(`api/campaign/DeleteCampaign/${id}`);
    return data.data;
}

export const getAllCampaignApi = async () => {
    const data = await request.get('api/campaign/GetAllCampaigns');
    return data.data;
};

export const getCampaignByIdApi = async (id: string) => {
    const data = await request.get(`api/campaign/GetCampaignById/${id}`);
    return data.data;
}

export const approveCampaignApi = async (params: ApproveCampaign) => {
    const data = await request.put('api/campaign/Approve', params);
    return data.data;
}

export const rejectCampaignApi = async (params: RejectCampaign) => {
    const data = await request.put('api/campaign/Reject', params);
    return data.data;
}

export const additionalCampaignApi = async (params: AdditionalCampaign) => {
    const data = await request.post('api/campaign/CommentCampaign', params);
    return data.data;
}

export const cancelCampaignApi = async (params: CancelCampaign) => {
    const data = await request.put('api/campaign/CancelCampaign', params);
    return data.data;
}