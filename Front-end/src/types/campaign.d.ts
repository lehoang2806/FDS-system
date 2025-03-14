interface AddCampaign {
    nameCampaign: string,
    description: string,
    giftType: string,
    giftQuantity: number,
    address: string,
    receiveDate: string
}

interface CampaignInfo {
    accountId: string;
    address: string;
    campaignId: string;
    dateCreated: string;
    dateUpdated: string | null;
    description: string;
    email: string;
    fullName: string;
    giftQuantity: number;
    giftType: string;
    isDeleted: boolean;
    nameCampaign: string;
    phone: string;
    receiveDate: string;
    roleId: number;
    status: "Pending" | "Approved" | "Rejected";
}

interface CampaignState {
    listCampaigns: CampaignInfo[]
}

interface ApproveCampaign {
    campaignId: string
}

interface RejectCampaign {
    campaignId: string;
    comment: string
}
