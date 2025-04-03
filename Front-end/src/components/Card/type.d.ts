type EventCardProps = {
    type: 1 | 2,
    news?: NewsInfo;
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