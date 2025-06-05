import { Selector } from "@/types/app";
import { UserProfile } from "@/types/auth";
import { RootState } from "./reducer";
import { currentOrganizationDonorCertificate, currentPersonalDonorCertificate, currentRecipientCertificate, DonorCertificate, RecipientCertificate, UserInfo } from "@/types/user";
import { CampaignInfo, CurrentCampaign, FeedbackCampaign, FeedbackDetail } from "@/types/campaign";
import { CampaignRequestSupport } from "@/types/campaignRequestSupport";

export const selectLoading: Selector<boolean> = (state: RootState) => {
    return state.app.loading;
}

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

export const selectGetProfileUser: Selector<UserInfo | null> = (state: RootState) => {
    return state.user.profileUser;
}

export const selectGetAllDonorCertificate: Selector<DonorCertificate[]> = (state: RootState) => {
    return state.user.listDonorCertificate;
}

export const selectGetAllRecipientCertificate: Selector<RecipientCertificate[]> = (state: RootState) => {
    return state.user.listRecipientCertificate;
}

export const selectGetPersonalDonorCertificateById: Selector<currentPersonalDonorCertificate> = (state: RootState) => {
    return state.user.currentDonorPersonalCertificate as currentPersonalDonorCertificate;
}

export const selectGetOrganizationDonorCertificateById: Selector<currentOrganizationDonorCertificate> = (state: RootState) => {
    return state.user.currentDonorOrganizationCertificate as currentOrganizationDonorCertificate;
}

export const selectGetRecipientCertificateById: Selector<currentRecipientCertificate> = (state: RootState) => {
    return state.user.currentRecipientCertificate as currentRecipientCertificate;
}

//Campaign
export const selectGetAllCampaign: Selector<CampaignInfo[]> = (state: RootState) => {
    return state.campaign.listCampaigns;
}

export const selectCurrentCampaign: Selector<CurrentCampaign | null> = (state: RootState) => {
    return state.campaign.currentCampaign;
}

export const selectGetAllFeedbackCampaign: Selector<FeedbackCampaign[]> = (state: RootState) => {
    return state.feedbackCampaign.listFeedbacksCampaign
}

export const selectGetFeedbackDetail: Selector<FeedbackDetail | null> = (state: RootState) => {
    return state.feedbackCampaign.feedbackDetail
}

//RegisterReciver
export const selectGetAllRegisterReceivers: Selector<RegisterReceiver[]> = (state: RootState) => {
    return state.registerReceiver.listRegisterReceivers;
}

//Notification
export const selectNotifications: Selector<NotificationDto[]> = (state: RootState) => {
    return state.notificate.notifications;
}

//News
export const selectGetAllNews: Selector<NewsInfo[]> = (state: RootState) => {
    return state.news.listNews
}

export const selectGetNewsById: Selector<NewsInfo | null> = (state: RootState) => {
    return state.news.currentNews;
}

//Post
export const selectGetAllPosts: Selector<Post[]> = (state: RootState) => {
    return state.post.listPosts;
}

export const selectGetPostById: Selector<PostInfo | null> = (state: RootState) => {
    return state.post.post;
}

//RequestSupport
export const selectGetAllRequestSupport: Selector<RequestSupportInfo[]> = (state: RootState) => {
    return state.requestSupport.listRequestSupport;
}

export const selectGetRequestSupportById: Selector<RequestSupportInfo | null> = (state: RootState) => {
    return state.requestSupport.requestSupport;
}

export const selectGetAllDonorSupport: Selector<DonorSupport[]> = (state: RootState) => {
    return state.requestSupport.listDonorSupport;
}

//Donate
export const selectGetAllDonate: Selector<Donate[]> = (state: RootState) => {
    return state.donate.donates;
}

export const selectGetDonateById: Selector<Donate | null> = (state: RootState) => {
    return state.donate.donate;
}

//Campaign Request Support
export const selectGetAllCampaignRequestSupport: Selector<CampaignRequestSupport[]> = (state: RootState) => {
    return state.campaignRequestSupport.listCampaignsRequestSupport;
}

export const selectGetCampaignRequestSupportById: Selector<CampaignRequestSupport | null> = (state: RootState) => {
    return state.campaignRequestSupport.campaignRequestSupportDetail;
}