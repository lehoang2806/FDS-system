import { SupporterAvatar, SupporterImage } from "@/assets/images";
import { useState } from "react";

const DetailSupporterPage = () => {
    const [activeTab, setActiveTab] = useState<"hoatdong" | "chiendich">("hoatdong");

    return (
        <main id="detail-supporter">
            <section id="ds-section-1"></section>
            <section id="ds-section-2">
                <div className="dss-container">
                    <div className="dsscr1">
                        <div className="dsscr1r1">
                            <div className="dsscr1r1c1">
                                <div className="dsscr1r1c1c1">
                                    <img src={SupporterAvatar} alt="" className="supporter-avatar" />
                                </div>
                                <div className="dsscr1r1c1c2">
                                    <h2>Tên người hỗ trợ</h2>
                                    <p>0 người theo dõi <span>| 0 bài viết</span></p>
                                </div>
                            </div>
                            <div className="dsscr1r1c2">
                                <button className="sc-btn">Theo dõi</button>
                            </div>
                        </div>
                        <div className="ds-tabs">
                            <div
                                className={`ds-tabs-item ${activeTab === "hoatdong" ? "ds-tabs-item-actived" : ""}`}
                                onClick={() => setActiveTab("hoatdong")}
                            >
                                Hoạt động
                            </div>
                            <div
                                className={`ds-tabs-item ${activeTab === "chiendich" ? "ds-tabs-item-actived" : ""}`}
                                onClick={() => setActiveTab("chiendich")}
                            >
                                Chiến dịch
                            </div>
                        </div>
                    </div>
                    <div className="dsscr2">
                        {activeTab === "hoatdong" && (
                            <div className="dsscr2-activity">
                                <div className="dsscr2-activity-r1">
                                    <img src={SupporterImage} alt="" />
                                </div>
                                <div className="dsscr2-activity-r2">
                                    <div className="dsscr2-activity-r2c1">
                                        <p>0</p>
                                        <h5>chiến dịch</h5>
                                    </div>
                                    <div className="dsscr2-activity-r2c2">
                                        <p>0</p>
                                        <h5>Bài viết</h5>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "chiendich" && (
                            <div className="dsscr2-campaign">
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default DetailSupporterPage