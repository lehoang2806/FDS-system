import { CampaignImage } from "@/assets/images";
import { FC } from "react"

const CampaignCard: FC<CampaignCardProps> = ({onClickDetail, campaign}) => {
    const date = campaign?.implementationTime.split("T")[0];
    const time = campaign?.implementationTime.split("T")[1].replace("Z", "");

    return (
        <div className="campaign-card" onClick={onClickDetail}>
            <img src={CampaignImage} className="campaign-img"/>
            <h4>{campaign.campaignName}</h4>
            <p>{date} - {time}</p>
            <p>{campaign.typeGift}</p>
            <p>{campaign.campaignType === "Limited" ? "Chiến dịch có phần quà giới hạn" : "Chiến dịch đăng ký theo nguyện vọng"}</p>
        </div>
    )
}

export default CampaignCard