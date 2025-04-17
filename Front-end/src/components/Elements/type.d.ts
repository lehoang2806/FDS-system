import { UserInfo } from "@/types/user";

type PostProps = {
    type?: 1 | 2,
    post: Post,
    user: UserInfo,
    isStatus?: boolean | null
}

interface SubcriberProps {
    registerReceiver: RegisterReceiver
}

interface CampaignCarouselProps {
    campaigns: CampaignInfo[];
    handleToDetailCampaign: (campaignId: string) => void
}