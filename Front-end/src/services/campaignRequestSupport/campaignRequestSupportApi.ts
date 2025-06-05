import {
    AdditionalCampaignRequestSupport,
    ApproveCampaignRequestSupport,
    CampaignRequestSupportActionsParams,
    CancelCampaignRequestSupport,
    RejectCampaignRequestSupport,
} from "@/types/campaignRequestSupport";
import request from "../request";

export const createCampaignRequestSupportApi = async (
    params: CampaignRequestSupportActionsParams
) => {
    const data = await request.post(
        "api/campaignrequestsupport/CreateCampaignRequestSupport",
        params
    );
    return data.data;
};

export const getAllCampaignsRequestSupportApi = async () => {
    const data = await request.get(
        "api/campaignrequestsupport/GetAllCampaignsRequestSupport"
    );
    return data.data;
};

export const getCampaignRequestSupportByIdApi = async (id: string) => {
    const data = await request.get(
        `api/campaignrequestsupport/GetCampaignRequestSupportById/${id}`
    );
    return data.data;
};

export const deleteCampaignRequestSupportApi = async (id: string) => {
    const data = await request.delete(
        `api/campaignrequestsupport/DeleteCampaign/${id}`
    );
    return data.data;
};

export const updateCampaignRequestSupportApi = async (
    id: string,
    params: CampaignRequestSupportActionsParams
) => {
    const data = await request.put(
        `api/campaignrequestsupport/UpdateCampaignRequestSupport/${id}`,
        params
    );
    return data.data;
};

export const approveCampaignRequestSupportApi = async (
    params: ApproveCampaignRequestSupport
) => {
    const data = await request.put(
        `api/campaignrequestsupport/Approve`,
        params
    );
    return data.data;
};

export const rejectCampaignRequestSupportApi = async (
    params: RejectCampaignRequestSupport
) => {
    const data = await request.put(
        `api/campaignrequestsupport/Reject`,
        params
    );
    return data.data;
};

export const additionalCampaignRequestSupportApi = async (
    params: AdditionalCampaignRequestSupport
) => {
    const data = await request.post(
        "api/campaignrequestsupport/CommentCampaign",
        params
    );
    return data.data;
};

export const CancelCampaignRequestSupportApi = async (
    params: CancelCampaignRequestSupport
) => {
    const data = await request.put(
        `api/campaignrequestsupport/CancelCampaignRequestSupport`,
        params
    );
    return data.data;
};
