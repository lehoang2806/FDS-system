import { FC } from "react";
import { CampaignCardProps } from "./type";

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
    const startDate = new Date(campaign.implementationTime);
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    const now = new Date();

    let status = "";
    if (now < startDate) {
        status = "Sắp diễn ra";
    } else if (now >= startDate && now <= endDate) {
        status = "Đang diễn ra";
    } else {
        status = "Đã kết thúc";
    }

    return (
        <div className="campaign-card" onClick={onClickDetail}>
            <div className="img-container">
                <img src={campaign?.images[0]} className="campaign-img" />
                <div className="overlay">
                    <span>Xem chi tiết</span>
                </div>
            </div>
            <h4>{campaign.campaignName}</h4>
            <p>
                {formattedDate} - {formattedTime}
            </p>
            <p>{campaign.limitedQuantity} Phần quà</p>
            <p>
                {campaign.location}, {campaign.district}
            </p>
            <p
                className={`cc-status ${
                    status === "Đã kết thúc"
                        ? "ended"
                        : status === "Đang diễn ra"
                        ? "ongoing"
                        : "upcoming"
                }`}
            >
                {status}
            </p>
        </div>
    );
};

export default CampaignCard;
