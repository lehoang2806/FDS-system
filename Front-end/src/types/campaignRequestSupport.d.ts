interface CampaignRequestSupportActionsParams {
    campaignRequestSupportName: string;
    campaignRequestSupportDescription: string;
    location: string;
    implementationTime: string;
    estimatedBudget: string;
    averageCostPerGift: string;
    sponsors: string;
    implementationMethod: string;
    communication: string;
    limitedQuantity: number;
    images: string[]; // Mảng URL ảnh (Cloudinary hoặc tương đương)
    requestSupportId: string;
}

export interface CampaignRequestSupport {
    campaignRequestSupportId: string | null;
    accountId: string;
    fullName: string;
    email: string;
    phone: string;
    roleId: number;
    campaignRequestSupportName: string | null;
    campaignRequestSupportDescription: string | null;
    location: string;
    implementationTime: string;
    estimatedBudget: string;
    averageCostPerGift: string;
    sponsors: string;
    implementationMethod: string;
    communication: string;
    limitedQuantity: number;
    images: string[];
    rejectComment: string | null;
    cancelComment: string | null;
    typeAccount: string;
    status: string;
    createdDate: string;
    district: string | null;
    reviewComments: ReviewComment[];
    requestSupportId: string;
}

export interface ReviewComment {
    createdDate: string;
    content: string;
}

interface CampaignRequestSupportState {
    listCampaignsRequestSupport: CampaignRequestSupport[];
    campaignRequestSupportDetail: CampaignRequestSupport | null;
}

interface ApproveCampaignRequestSupport {
    campaignRequestSupportId: string;
}

interface RejectCampaignRequestSupport {
    campaignRequestSupportId: string;
    comment: string;
}

interface AdditionalCampaignRequestSupport {
    campaignRequestSupportId: string;
    content: string;
}

interface CancelCampaignRequestSupport {
    campaignRequestSupportId: string;
    comment: string;
}
