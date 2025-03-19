import { FC } from "react"

const CampaignCard: FC<CampaignCardProps> = ({onClickDetail, campaign}) => {
    const date = campaign?.receiveDate.split("T")[0];
    const time = campaign?.receiveDate.split("T")[1].replace("Z", "");

    return (
        <div className="campaign-card" onClick={onClickDetail}>
            <div className="campaign-img"></div>
            <h4>{campaign.nameCampaign}</h4>
            <p>{date} - {time}</p>
        </div>
    )
}

export default CampaignCard