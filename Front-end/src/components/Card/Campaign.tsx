import { FC } from "react"

const CampaignCard: FC<CampaignCardProps> = ({onClickDetail, campaign}) => {
    const date = campaign?.receiveDate.split("T")[0];
    const time = campaign?.receiveDate.split("T")[1].replace("Z", "");

    return (
        <div className="campaign-card" onClick={onClickDetail}>
            <div className="campaign-img"></div>
            <h4>{campaign.nameCampaign}</h4>
            <p>{date} - {time}</p>
            <p>{campaign.giftType}</p>
            <p>{campaign.typeCampaign ? "Chiến dịch có phần quà giới hạn" : "Chiến dịch đăng ký theo nguyện vọng"}</p>
        </div>
    )
}

export default CampaignCard