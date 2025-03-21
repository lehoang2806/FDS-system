import { Selector } from "@/types/app";
import { UserProfile } from "@/types/auth";
import { RootState } from "./reducer";
import { DonorCertificate, RecipientCertificate, UserInfo } from "@/types/user";

export const selectUserLogin: Selector<UserProfile|null> = (state: RootState) => {
    return state.auth.userInfo;
}

export const selectIsAuthenticated: Selector<boolean> = (state: RootState) => {
    return state.auth.isAuthenticated;
}

export const selectToken: Selector<string|null> = (state: RootState) => {
    return state.auth.token;
}

//User
export const selectGetAllUser: Selector<UserInfo[]> = (state: RootState) => {
    return state.user.listUser;
}

export const selectGetAllDonorCertificate: Selector<DonorCertificate[]> = (state: RootState) => {
    return state.user.listDonorCertificate;
}

export const selectGetAllRecipientCertificate: Selector<RecipientCertificate[]> = (state: RootState) => {
    return state.user.listRecipientCertificate;
}

//Campaign
export const selectGetAllCampaign: Selector<CampaignInfo[]> = (state: RootState) => {
    return state.campaign.listCampaigns;
}

export const selectCurrentCampaign: Selector<CurrentCampaign | null> = (state: RootState) => {
    return state.campaign.currentCampaign;
}

//RegisterReciver
export const selectGetAllRegisterReceivers: Selector<RegisterReceiver[]> = (state: RootState) => {
    return state.registerReceiver.listRegisterReceivers;
}