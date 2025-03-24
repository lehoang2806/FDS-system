interface AddCampaign {
    nameCampaign: string;
    description: string;
    giftType: string;
    giftQuantity: number;
    address: string;
    receiveDate: string;
    startRegisterDate: string;
    endRegisterDate: string;
    images: [];
    typeCampaign: string | "Limited" | "Voluntary";
}

interface CampaignInfo {
    campaignId: string;
    accountId: string;
    fullName: string;
    email: string;
    phone: string;
    roleId: number;
    nameCampaign: string;
    description: string;
    giftType: string;
    giftQuantity: number;
    address: string;
    receiveDate: string;
    dateCreated: string;
    dateUpdated: string | null;
    isDeleted: boolean;
    status: string;
    typeAccount: string;
    rejectComment: string | null;
    startRegisterDate: string;
    endRegisterDate: string;
    image: string;
    typeCampaign: string;
}

interface CurrentCampaign {
    id: string;
    campaignId: string;
    accountId: string;
    nameCampaign: string;
    description: string;
    giftType: string;
    address: string;
    receiveDate: string;
    dateCreated: string;
    dateUpdated: string | null;
    isDeleted: boolean;
    status: "Pending" | "Approved" | "Rejected";
    typeCampaign: "Limited" | "Voluntary";
    giftQuantity?: number;
    startRegisterDate?: string;
    endRegisterDate?: string;
    rejectComment?: string | null;
    comment?: string | null;
    typeAccount: "Personal Donor" | "Organization";
    reviewComments?: ReviewComment[] | null;
    cancelComment?: string | null;
    images: string[];
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

interface ReviewComment {
    createDate: string;
    content: string;
}
