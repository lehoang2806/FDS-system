import { UserInfo } from "@/types/user";

type PostProps = {
    type?: 1 | 2,
    post: Post,
    user: UserInfo
}

interface SubcriberProps {
    registerReceiver: RegisterReceiver
}

interface CampaignCarouselProps {
    campaigns: CampaignInfo[];
    handleToDetailCampaign: (campaignId: string) => void
}