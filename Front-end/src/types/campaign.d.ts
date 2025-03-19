interface AddCampaign {
    nameCampaign: string;
    description: string;
    giftType: string;
    giftQuantity: number;
    address: string;
    receiveDate: string;
    limitedQuantity: number;
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
    type: string;
    limitedQuantity: number | string;
    rejectComment: string | null;
}

interface CurrentCampaign {
    id: string;
    campaignId: string;
    accountId: string;
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
    rejectComment: string | null;
    limitedQuantity: number;
    comment: string | null;
    type: string;
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
