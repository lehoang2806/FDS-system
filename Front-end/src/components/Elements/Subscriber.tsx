import { FC } from "react"
import { SubcriberProps } from "./type"

const Subscriber: FC<SubcriberProps> = ({ registerReceiver }) => {
    return (
        <div className='subscriber-container'>
            <div className="scc1">
                <figure className="s-figure">
                    <div className="s-img"></div>
                </figure>
            </div>
            <div className="scc2">
                <h4>Tên người đăng ký: {registerReceiver.registerReceiverName}</h4>
                <p>Số phần đăng ký: {registerReceiver.quantity}</p>
            </div>
        </div>
    )
}

export default Subscriber