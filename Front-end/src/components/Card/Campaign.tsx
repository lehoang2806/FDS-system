import { FC } from "react"

const CampaignCard: FC<CampaignCardProps> = ({ onClickDetail, campaign }) => {
    // Formated Date
    const dateStr = campaign?.implementationTime.split("T")[0];
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    // Formated Time
    const formattedTime = campaign?.implementationTime
        .split("T")[1]
        .replace("Z", "")
        .split(":")
        .slice(0, 2)
        .join(":");

    // Xử lý status dựa trên thời gian
    const campaignDate = new Date(campaign.implementationTime);
    const currentDate = new Date();

    let status = "";
    if (campaignDate < currentDate) {
        status = "Đã kết thúc";
    } else if (
        campaignDate.getFullYear() === currentDate.getFullYear() &&
        campaignDate.getMonth() === currentDate.getMonth() &&
        campaignDate.getDate() === currentDate.getDate()
    ) {
        status = "Đang diễn ra";
    } else {
        status = "Sắp diễn ra";
    }

    return (
        <div className="campaign-card" onClick={onClickDetail}>
            <img src={campaign?.images[0]} className="campaign-img" />
            <h4>{campaign.campaignName}</h4>
            <p>{formattedDate} - {formattedTime}</p>
            <p>{campaign.typeGift}</p>
            <p>
                {campaign.campaignType === "Limited"
                    ? "Chiến dịch có phần quà giới hạn"
                    : "Chiến dịch đăng ký theo nguyện vọng"}
            </p>
            <p className={`cc-status ${status === "Đã kết thúc" ? "ended" : status === "Đang diễn ra" ? "ongoing" : "upcoming"}`}>
                {status}
            </p>
        </div>
    );
}

export default CampaignCard;
