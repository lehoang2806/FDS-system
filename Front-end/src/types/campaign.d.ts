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

interface FeedbackCampaignState {
    listFeedbacksCampaign: FeedbackCampaign[];
    feedbackDetail: FeedbackDetail | null;
}

interface CreateFeedbackCampaign {
    campaignId: string;
    feedbackContent: string;
    images: string[];
}

interface FeedbackCampaign {
    feedBackId: string;
    campaignId: string;
    accountId: string;
    fullName: string;
    content: string;
    images: string[];
    dateCreated: string;
    dateUpdated: string | null;
    replies: [] | null;
}

interface FeedbackDetailComment {
    fullName: string;
    content: string;
    createdDate: string;
}

interface FeedbackDetail {
    feedBackId: string;
    campaignId: string | null;
    accountId: string | null;
    fullName: string | null;
    content: string;
    images: string[];
    dateCreated: string | null;
    dateUpdated: string | null;
    likes: FeedbackLike[];
    comments: FeedbackDetailComment[];
    replies: any[] | null;
}

interface FeedbackLike {
    accountId: string;
    createdDate: string;
    fullName: string;
}

