type PostProps = {
    type?: 1 | 2
}

interface SubcriberProps {
    registerReceiver: RegisterReceiver
}

interface CampaignCarouselProps {
    campaigns: CampaignInfo[];
    handleToDetailCampaign: (campaignId: string) => void
}