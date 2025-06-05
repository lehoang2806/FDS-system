import { FC } from "react";
import dayjs from "dayjs";
import { CampaignCardProps } from "./type";

const CampaignCard: FC<CampaignCardProps> = ({ onClickDetail, campaign }) => {
    // Format ngày và giờ
    const date = dayjs(campaign?.implementationTime);
    const formattedDate = date.format("DD-MM-YYYY");
    const formattedTime = date.format("HH:mm");

    // Tính thời gian bắt đầu và kết thúc
    const startDate = dayjs(campaign?.implementationTime);
    const endDate = startDate.endOf("day"); // hết ngày hôm đó
    const now = dayjs(); // thời gian hiện tại

    // Xác định trạng thái chiến dịch
    let status = "";
    if (now.isBefore(startDate)) {
        status = "Sắp diễn ra";
    } else if (now.isAfter(endDate)) {
        status = "Đã kết thúc";
    } else {
        status = "Đang diễn ra";
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
