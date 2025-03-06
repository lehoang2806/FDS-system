import { Post } from "@/components/Elements"
import { FC } from "react"

const StaffForumPostPage: FC = () => {
    return (
        <section id="admin-forum-post" className="admin-section">
            <div className="admin-container afp-container">
                <div className="afpcr1">
                    <h1>Post</h1>
                    <p>Dashboard<span className="admin-tag">Post</span></p>
                </div>
                <div className="afpcr2">
                    <Post />
                    <Post />
                    <Post />
                </div>
            </div>
        </section>
    )
}

export default StaffForumPostPage