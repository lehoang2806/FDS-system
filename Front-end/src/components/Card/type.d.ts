import { CampaignInfo } from "@/types/campaign";

type EventCardProps = {
    type: 1 | 2,
    news?: NewsInfo;
    onClickDetail?: () => void,
};

type CampaignCardProps = {
    onClickDetail?: () => void,
    campaign: CampaignInfo
}

type SupporterCardProps = {
    onClickDetail?: () => void,
}

type NewsCardProps = {
    news?: NewsInfo,
    onClickDetail?: () => void,
}