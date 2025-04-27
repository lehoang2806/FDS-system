import { SupporterLogo } from "@/assets/images"
import { FC } from "react"
import { SupporterCardProps } from "./type"

const SupporterCard: FC<SupporterCardProps> = ({onClickDetail}) => {
    return (
        <div className="supporter-card">
            <div className="scr1">
                <img src={SupporterLogo} alt="" className="sc-img" />
                <h3>Tên tổ chức</h3>
            </div>
            <div className="line"></div>
            <div className="scr2">
                <p>Tài khoản thiện nguyện số: <span>1</span></p>
                <p>Tham gia từ: <span>1/2025</span></p>
                <h6 onClick={onClickDetail}>Xem chi tiết</h6>
            </div>
        </div>
    )
}

export default SupporterCard