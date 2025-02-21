import { Link } from "react-router-dom";
import { CampaignCard, EventCard, HightlightCard } from "../../components/Card";
import { routes } from "@/routes/routeName";
import { navigateHook } from "@/routes/RouteApp";

export default function () {
    const handleToDetail = (campaignId: string) => {
        const url = routes.user.campaign.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <>
            <section id='landing-s1'>
            </section>
            <section id="landing-s2" className="landing-section">
                <div className="landing-container ls2-container">
                    <div className="ls2cr1">
                        <h2>Chiến dịch từ thiện nổi bật</h2>
                    </div>
                    <div className="ls2cr2">
                        <div className="ls2cr2r1">
                            <h3>Chiến dịch của tổ chức</h3>
                            <Link to={routes.user.campaign.list} className="view-all">Xem tất cả</Link>
                        </div>
                        <div className="ls2cr2r2">
                            <CampaignCard onClickDetail={() => handleToDetail("1")}/>
                            <CampaignCard />
                            <CampaignCard />
                        </div>
                        <div className="pagination-lists">
                            <span className="pagination-item pagination-item-active"></span>
                            <span className="pagination-item"></span>
                            <span className="pagination-item"></span>
                            <span className="pagination-item"></span>
                            <span className="pagination-item"></span>
                        </div>
                    </div>
                    <div className="ls2cr3">
                        <div className="ls2cr3r1">
                            <h3>Chiến dịch của tổ chức</h3>
                            <Link to={"/"} className="view-all">Xem tất cả</Link>
                        </div>
                        <div className="ls2cr3r2">
                            <CampaignCard />
                            <CampaignCard />
                            <CampaignCard />
                        </div>
                        <div className="pagination-lists">
                            <span className="pagination-item pagination-item-active"></span>
                            <span className="pagination-item"></span>
                            <span className="pagination-item"></span>
                            <span className="pagination-item"></span>
                            <span className="pagination-item"></span>
                        </div>
                    </div>
                </div>
            </section>
            <section id="landing-s3" className="landing-section">
                <div className="landing-container ls3-container">
                    <h2>Đồng Hành Cùng Chúng Tôi</h2>
                    <div className="ls3r1">
                        <div className="ls3r1c1">
                            <figure className="ls3-img"><img src="assets/images/ls3.svg" alt="" /></figure>
                        </div>
                        <div className="ls3r1c2">
                            <div className="ls3r1c2-item">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="ls3r1c2-item-dot ls3r1c2-item-dot-1"></div><p className="ls3r1c2-item-title">Tổ chức</p>
                                </div>
                                <p className="ls3r1c2-item-quantity">123,123</p>
                            </div>
                            <div className="ls3r1c2-item">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="ls3r1c2-item-dot ls3r1c2-item-dot-1"></div><p className="ls3r1c2-item-title">Tổ chức</p>
                                </div>
                                <p className="ls3r1c2-item-quantity">123,123</p>
                            </div>
                            <div className="ls3r1c2-item">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div className="ls3r1c2-item-dot ls3r1c2-item-dot-1"></div><p className="ls3r1c2-item-title">Tổ chức</p>
                                </div>
                                <p className="ls3r1c2-item-quantity">123,123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="landing-s4" className="landing-section">
                <div className="landing-container ls4-container">
                    <div className="ls4cr1">
                        <h2>Các tổ chức, cá nhân nổi bật</h2>
                        <Link to={"/"}>Xem tất cả</Link>
                    </div>
                    <div className="ls4cr2">
                        <HightlightCard />
                        <HightlightCard />
                        <HightlightCard />
                    </div>
                </div>
            </section>
            <section id="landing-s5" className="landing-section">
                <div className="landing-container ls5-container">
                    <div className="ls5cr1">
                        <h2><span>Sự kiện </span>thiện nghiện</h2>
                        <Link to={"/"} className="view-all">Xem tất cả</Link>
                    </div>
                    <div className="ls5cr2">
                        <div className="ls5cr2c1">
                            <EventCard type={1} />
                        </div>
                        <div className="ls5cr2c2">
                            <EventCard type={2} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

