import { FC } from "react"

const EventCard: FC<EventCardProps> = ({ type }) => {
    if (type === 1) return (
        <div className="event-card-1">
            <div className="ec1-img"></div>
            <h4 className="ec1-name">Ten</h4>
            <p className="ec1-date">Ngay</p>
            <p className="ec1-address">Dia chi</p>
        </div>
    )

    if (type === 2) return (
        <div className="event-card-2">
            <div className="ec2c1">
                <h4 className="ec2-name">Ten</h4>
                <p className="ec2-date">Ngay</p>
                <p className="ec2-address">Dia chi</p>
            </div>
            <div className="ec2c2">
                <div className="ec2-img"></div>
            </div>
        </div>
    )
}

export default EventCard