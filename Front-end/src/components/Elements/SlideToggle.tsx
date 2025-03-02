import { FC } from "react"

const SlideToggle: FC = () => {
    return (
        <div className="d-flex flex-ver-center slide-toggle">
            <label className="st-switch">
                <input type="checkbox" />
                <span className="st-slider st-round"></span>
            </label>
        </div>
    )
}

export default SlideToggle