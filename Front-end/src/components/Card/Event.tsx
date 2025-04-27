import { FC } from "react"
import { EventCardProps } from "./type"

const EventCard: FC<EventCardProps> = ({ type, news, onClickDetail }) => {
    const createdDate = news?.createdDate && news?.createdDate.split('T')[0]

    if (type === 1) return (
        <div className="event-card-1">
            <img src={news?.images[0]} className="ec1-img" />
            <h4 className="ec1-name" onClick={onClickDetail}>{news?.newsTitle}</h4>
            <p className="ec1-date">{createdDate}</p>
        </div>
    )

    if (type === 2) return (
        <div className="event-card-2">
            <div className="ec2c1">
                <h4 className="ec2-name">{news?.newsTitle}</h4>
                <p className="ec2-date">{createdDate}</p>
            </div>
            <div className="ec2c2">
                <img src={news?.images[0]} className="ec2-img" />

            </div>
        </div>
    )
}

export default EventCard