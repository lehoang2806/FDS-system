type PostProps = {
    type?: 1 | 2,
    post: Post,
}

interface SubcriberProps {
    registerReceiver: RegisterReceiver
}

interface CampaignCarouselProps {
    campaigns: CampaignInfo[];
    handleToDetailCampaign: (campaignId: string) => void
}