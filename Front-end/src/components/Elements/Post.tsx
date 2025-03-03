import { CommentIcon, FarvoriteIcon } from "@/assets/icons"
import { FC } from "react"

const Post: FC<PostProps> = ({type = 1}) => {
    return (
        <div className="post-container">
            <div className="pcr1">
                <div className="pcr1c1">
                    <div className="p-img"></div>
                </div>
                <div className="pcr1c2">
                    <h5 className="p-name">Tên người dùng</h5>
                    <p className="p-time">Thời gian đăng</p>
                </div>
            </div>
            <div className="pcr2">
                <div className="pcr2-content">Nội dung bài viết</div>
                <div className="pcr2-img"></div>
            </div>
            {type === 1 ? (
                <div className="pcr3">
                <div className="pcr3c1">
                    <FarvoriteIcon className="pcr3-icon"/>
                    <CommentIcon className="pcr3-icon"/>
                </div>
                <div className="pcr3c2">
                    <p>0 lượt thích</p>
                    <div className="dot"></div>
                    <p>0 bình luận</p>
                </div>
            </div>
            ) : (
                <div className="pcr3">
                    <button className="reject-btn">Reject</button>
                    <button className="approve-btn">Approve</button>
                </div>
            )}
            
        </div>
    )
}

export default Post