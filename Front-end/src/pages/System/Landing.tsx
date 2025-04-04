import { Link } from "react-router-dom";
import { CampaignCard, EventCard, HightlightCard } from "../../components/Card/index";
import { routes } from "@/routes/routeName";
import { navigateHook } from "@/routes/RouteApp";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectGetAllCampaign, selectGetAllNews } from "@/app/selector";
import { useEffect } from "react";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { setLoading } from "@/services/app/appSlice";
import { getAllNewsApiThunk } from "@/services/news/newsThunk";

export default function () {
    const dispatch = useAppDispatch();

    const handleToDetailCampaign = (campaignId: string) => {
        const url = routes.user.campaign.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    const handleToDetailNews = (newsId: string) => {
        const url = routes.user.news.detail.replace(":id", newsId);
        return navigateHook(url)
    }

    const campaigns = useAppSelector(selectGetAllCampaign)
    const news = useAppSelector(selectGetAllNews)

    const approvedCampaigns = campaigns.filter((campaign) => campaign.status === "Approved");

    const personalCampaigns = approvedCampaigns.filter((campaign) => campaign.typeAccount === "Personal Donor");

    const organizationCampaigns = approvedCampaigns.filter((campaign) => campaign.typeAccount === "Organization Donor");

    useEffect(() => {
        document.title = "Trang chủ";
        dispatch(setLoading(true));

        Promise.all([
            dispatch(getAllCampaignApiThunk()).unwrap(),
            dispatch(getAllNewsApiThunk()).unwrap()
        ])
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

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
                            <Link to={`${routes.user.campaign.list}?tab=1`} className="view-all">Xem tất cả</Link>
                        </div>
                        <div className="ls2cr2r2">
                            {organizationCampaigns.length > 0 ? organizationCampaigns.map((campaign) => (
                                <CampaignCard campaign={campaign} key={campaign.campaignId} onClickDetail={() => handleToDetailCampaign(campaign.campaignId)} />
                            )) : (
                                <h1>Chưa có dữ liệu</h1>
                            )}
                        </div>
                    </div>
                    <div className="ls2cr3">
                        <div className="ls2cr3r1">
                            <h3>Chiến dịch của Cá nhân</h3>
                            <Link to={`${routes.user.campaign.list}?tab=2`} className="view-all">Xem tất cả</Link>
                        </div>
                        <div className="ls2cr3r2">
                            {personalCampaigns.length > 0 ? personalCampaigns.map((campaign) => (
                                <CampaignCard campaign={campaign} key={campaign.campaignId} onClickDetail={() => handleToDetailCampaign(campaign.campaignId)} />
                            )) : (
                                <h1>Chưa có dữ liệu</h1>
                            )}
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
                        <Link to={routes.user.supporter.list}>Xem tất cả</Link>
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
                        <h2><span>Tin tức </span>thiện nghiện</h2>
                        <Link to={routes.user.news.list} className="view-all">Xem tất cả</Link>
                    </div>
                    <div className="ls5cr2">
                        <div className="ls5cr2c1">
                            {news?.[0] && <EventCard type={1} news={news[0]} onClickDetail={() => handleToDetailNews(news[0].newId)}/>}
                        </div>
                        <div className="ls5cr2c2">
                            {news.slice(1, 6).map((item, index) => (
                                <EventCard key={index} type={2} news={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

