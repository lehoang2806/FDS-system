import { FC } from "react"

const CampaignCard: FC<CampaignCardProps> = ({onClickDetail}) => {
    return (
        <div className="campaign-card" onClick={onClickDetail}>
            <div className="campaign-img"></div>
            <h4>Tiêu đề</h4>
            <p>Ngày hết hạn</p>
        </div>
    )
}

export default CampaignCard