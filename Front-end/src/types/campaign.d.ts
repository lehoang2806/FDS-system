interface AddCampaign {
    camapignId?: string;
    campaignName: string;
    campaignDescription: string;
    location: string;
    implementationTime: string;
    typeGift: string;
    estimatedBudget: string;
    averageCostPerGift: string;
    sponsors: string;
    implementationMethod: string;
    communication: string;
    limitedQuantity: string;
    campaignType: string;
    startRegisterDate: string;
    endRegisterDate: string;
    images: string[];
}

interface UpdateCampaign {
    campaignName: string;
    campaignDescription: string;
    location: string;
    implementationTime: string;
    typeGift: string;
    estimatedBudget: string;
    averageCostPerGift: string;
    sponsors: string;
    implementationMethod: string;
    communication: string;
    limitedQuantity: string;
    campaignType: string;
    startRegisterDate: string;
    endRegisterDate: string;
    images: string[];
}

interface CampaignInfo {
    campaignId: string;
    accountId: string;
    fullName: string;
    email: string;
    phone: string;
    roleId: number;
    campaignName: string;
    campaignDescription: string;
    location: string;
    implementationTime: string;
    typeGift: string;
    estimatedBudget: string;
    averageCostPerGift: string;
    sponsors: string;
    implementationMethod: string;
    communication: string;
    limitedQuantity: string;
    campaignType: string;
    startRegisterDate: string;
    endRegisterDate: string;
    images: string[];
    rejectComment: string | null;
    cancelComment: string | null;
    typeAccount: string;
    status: string;
    reviewComments: ReviewComment[] | null;
}

interface CurrentCampaign {
    id?: string;
    campaignId: string;
    accountId: string;
    campaignName: string;
    campaignDescription: string;
    location: string;
    implementationTime: string;
    typeGift: string;
    estimatedBudget: string;
    averageCostPerGift: string;
    sponsors: string;
    implementationMethod: string;
    communication: string;
    limitedQuantity: string;
    status: string;
    rejectComment: string | null;
    typeAccount: string;
    campaignType: string;
    reviewComments: ReviewComment[] | null;
    cancelComment: string | null;
    startRegisterDate: string;
    endRegisterDate: string;
    images: string[];
    createdDate: string;
}

interface CampaignState {
    listCampaigns: CampaignInfo[];
    currentCampaign: CurrentCampaign | null;
}

interface ApproveCampaign {
    campaignId: string;
}

interface RejectCampaign {
    campaignId: string;
    comment: string;
}

interface AdditionalCampaign {
    campaignId: string;
    content: string;
}

interface CancelCampaign {
    campaignId: string;
    comment: string;
}

interface ReviewComment {
    createDate: string;
    content: string;
}
