import { Post } from "@/components/Elements"
import { FC, useState } from "react"

const StaffListPostPage: FC = () => {
    const [activeTab, setActiveTab] = useState<"all" | "staff" | "pending">("all");

    return (
        <section id="staff-list-post" className="staff-section">
            <div className="staff-container slp-container">
                <div className="slpcr1">
                    <h1>Post</h1>
                    <p>Dashboard<span className="staff-tag">Post</span></p>
                </div>
                <div className="slpcr2">
                    <div className="slpcr2c1">
                        <div
                            className={`slp-tab ${activeTab === "all" ? "slp-tab-actived" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >All</div>
                        <div
                            className={`slp-tab ${activeTab === "staff" ? "slp-tab-actived" : ""}`}
                            onClick={() => setActiveTab("staff")}
                        >Staff</div>
                        <div 
                            className={`slp-tab ${activeTab === "pending" ? "slp-tab-actived" : ""}`}
                            onClick={() => setActiveTab("pending")}
                        >User's Post Pending</div>
                    </div>
                    <div className="slpcr2c2">
                        {activeTab === "all" && (
                            <>
                                <Post />
                                <Post />
                                <Post />
                                <Post />
                            </>
                        )}
                        {activeTab === "staff" && (
                            <>
                                <Post />
                                <Post />
                            </>
                        )}
                        {activeTab === "pending" && (
                            <>
                                <Post type={2}/>
                                <Post type={2}/>
                                <Post type={2}/>
                                <Post type={2}/>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffListPostPage