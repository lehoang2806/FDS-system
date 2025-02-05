import { FC } from "react"

const HightlightCard: FC = () => {
    return (
        <div className="highlight-card">
            <figure className="highlight-img">
                <img src="" alt="" />
            </figure>
            <h3 className="highlight-name">Tên</h3>
            <button className="highlight-btn">Theo dõi</button>
        </div>
    )
}

export default HightlightCard