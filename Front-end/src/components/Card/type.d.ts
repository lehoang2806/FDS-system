type EventCardProps = {
    type: 1 | 2,
};

type CampaignCardProps = {
    onClickDetail?: () => void,
    campaign: CampaignInfo
}

type SupporterCardProps = {
    onClickDetail?: () => void,
}

type NewsCardProps = {
    onClickDetail?: () => void,
}