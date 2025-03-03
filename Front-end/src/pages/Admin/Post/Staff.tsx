import { Post } from "@/components/Elements"
import { FC } from "react"

const AdminStaffPostPage: FC = () => {
    return (
        <section id="admin-staff-post" className="admin-section">
            <div className="admin-container asp-container">
                <div className="aspcr1">
                    <h1>Staff's Post</h1>
                    <p>Dashboard<span className="admin-tag">Staff's Post</span></p>
                </div>
                <div className="aspcr2">
                    <Post type={2}/>
                    <Post type={2}/>
                    <Post type={2}/>
                </div>
            </div>
        </section>
    )
}

export default AdminStaffPostPage