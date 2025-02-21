import { CampaignCard } from '@/components/Card';
import { Subscriber } from '@/components/Elements'
import { routes } from '@/routes/routeName';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const DetailCampaignPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"mota" | "dangky">("mota");

    return (
        <main id="detail-campaign">
            <section id="dc-section">
                <div className="dcs-container">
                    <div className="dcscr1">
                        <div className="dcscr1c1">
                            <div className="dcscr1c1r1">
                                <h1>Tên chiến dịch</h1>
                            </div>
                            <div className="dcscr1c1r2">
                                <div className='dc-img'></div>
                            </div>
                            <div className="dcscr1c1r3">
                                <div
                                    className={`dcscr1c1r3-tags-item ${activeTab === "mota" ? "dcscr1c1r3-tags-item-actived" : ""}`}
                                    onClick={() => setActiveTab("mota")}
                                >
                                    Mô tả
                                </div>
                                <div
                                    className={`dcscr1c1r3-tags-item ${activeTab === "dangky" ? "dcscr1c1r3-tags-item-actived" : ""}`}
                                    onClick={() => setActiveTab("dangky")}
                                >
                                    Số người đăng ký nhận quà
                                </div>
                            </div>
                            <div className="dcscr1c1r4">
                                {activeTab === "mota" ? (
                                    <div className="dcscr1c1r4-content">1</div>
                                ) : (
                                    <div className="dcscr1c1r4-content">2</div>
                                )}
                            </div>
                        </div>
                        <div className="dcscr1c2">
                            <div className="dcscr1c2r1">
                                <div>
                                    <h4>Phần quà</h4>
                                    <p>1000 thùng mì tôm</p>
                                </div>
                                <div>
                                    <h4>Thời gian còn lại</h4>
                                    <p>3 ngày</p>
                                </div>
                                <button className='sc-btn'>Đăng ký nhận hỗ trợ</button>
                            </div>
                            <div className="dcscr1c2r2">
                                <h3>Danh sách dăng ký nhận hỗ trợ</h3>
                                <div className="dcscr1c2r2-lists">
                                    <Subscriber />
                                    <Subscriber />
                                    <Subscriber />
                                    <Subscriber />
                                    <Subscriber />
                                    <Subscriber />
                                    <Subscriber />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="dcscr2">
                        <div className="dcscr2r1">
                            <h2>Các chiến dịch khác</h2>
                            <Link to={routes.user.campaign.list}>Xem tất cả</Link>
                        </div>
                        <div className="dcscr2r2">
                            <CampaignCard />
                            <CampaignCard />
                            <CampaignCard />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default DetailCampaignPage