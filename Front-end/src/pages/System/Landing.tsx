import { Link } from "react-router-dom";
import { EventCard } from "../../components/Card/index";
import { routes } from "@/routes/routeName";
import { navigateHook } from "@/routes/RouteApp";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
    selectGetAllCampaign,
    selectGetAllNews,
    selectGetAllUser,
} from "@/app/selector";
import { useEffect } from "react";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { setLoading } from "@/services/app/appSlice";
import { getAllNewsApiThunk } from "@/services/news/newsThunk";
import { CampaignCarousel, CarouselLanding } from "@/components/Elements";
import { getAllUserApiThunk } from "@/services/user/userThunk";
import { OrganizationIcon, PersonalIcon } from "@/assets/icons";
import { LS3 } from "@/assets/images";

export default function () {
    const dispatch = useAppDispatch();

    const handleToDetailCampaign = (campaignId: string) => {
        const url = routes.user.campaign.detail.replace(":id", campaignId);
        return navigateHook(url);
    };

    const handleToDetailNews = (newsId: string) => {
        const url = routes.user.news.detail.replace(":id", newsId);
        return navigateHook(url);
    };

    const campaigns = useAppSelector(selectGetAllCampaign);
    const sortedCampaigns = [...campaigns].reverse();
    const news = useAppSelector(selectGetAllNews);
    const sortedNews = [...news].reverse();

    const approvedCampaigns = sortedCampaigns.filter(
        (campaign) => campaign.status === "Approved"
    );

    const personalCampaigns = approvedCampaigns.filter(
        (campaign) => campaign.typeAccount === "Personal Donor"
    );

    const totalPersonalLimitedQuantity = personalCampaigns.reduce(
        (total, campaign) => {
            return total + Number(campaign.limitedQuantity || 0);
        },
        0
    );

    const organizationCampaigns = approvedCampaigns.filter(
        (campaign) => campaign.typeAccount === "Organization Donor"
    );

    const totalOrganizationLimitedQuantity = organizationCampaigns.reduce(
        (total, campaign) => {
            return total + Number(campaign.limitedQuantity || 0);
        },
        0
    );

    useEffect(() => {
        document.title = "Trang chủ";
        dispatch(setLoading(true));
        Promise.all([
            dispatch(getAllCampaignApiThunk()).unwrap(),
            dispatch(getAllNewsApiThunk()).unwrap(),
            dispatch(getAllUserApiThunk()),
        ])
            .catch((_) => {})
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, []);

    const users = useAppSelector(selectGetAllUser);
    const confirmedUsers = users.filter((user) => user.isConfirm === true);
    console.log(users)
    const confirmedPersonalDonors = confirmedUsers.filter(
        (user) => user.type === "1"
    );
    const confirmedOrganizationDonors = confirmedUsers.filter(
        (user) => user.type === "2"
    );

    return (
        <>
            <section id="landing-s1">
                <CarouselLanding />
            </section>
            <section id="landing-s2" className="landing-section">
                <div className="landing-container ls2-container">
                    <div className="ls2cr1">
                        <h2>Chiến dịch từ thiện nổi bật</h2>
                    </div>
                    <div className="ls2cr2">
                        <div className="ls2cr2r1">
                            <h3>Chiến dịch của tổ chức</h3>
                            <Link
                                to={`${routes.user.campaign.list}?tab=2`}
                                className="view-all"
                            >
                                Xem tất cả
                            </Link>
                        </div>
                        <div className="ls2cr2r2">
                            <CampaignCarousel
                                campaigns={organizationCampaigns}
                                handleToDetailCampaign={handleToDetailCampaign}
                            />
                        </div>
                    </div>
                    <div className="ls2cr3">
                        <div className="ls2cr3r1">
                            <h3>Chiến dịch của Cá nhân</h3>
                            <Link
                                to={`${routes.user.campaign.list}?tab=1`}
                                className="view-all"
                            >
                                Xem tất cả
                            </Link>
                        </div>
                        <div className="ls2cr3r2">
                            <CampaignCarousel
                                campaigns={personalCampaigns}
                                handleToDetailCampaign={handleToDetailCampaign}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section id="landing-s3" className="landing-section">
                <div className="landing-container ls3-container">
                    <h2>Đồng Hành Cùng Chúng Tôi</h2>
                    <div className="ls3r1">
                        <div className="col-flex ls3r1c1">
                            <img src={LS3} alt="" />
                        </div>
                        <div className="col-flex ls3r1c2">
                            <div className="ls3r1c2c1">
                                <div className="ls3r1c2-item">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <OrganizationIcon className="ls3r1c2-item-icon" />
                                        <p className="ls3r1c2-item-title">
                                            Tổ chức
                                        </p>
                                    </div>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Tổ chức đồng hành: </span>
                                        {confirmedOrganizationDonors.length} tổ
                                        chức
                                    </p>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Chiến dịch diễn ra: </span>
                                        {organizationCampaigns.length} chiến
                                        dịch
                                    </p>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Tổng số phần quà: </span>
                                        {totalOrganizationLimitedQuantity} phần
                                        quà
                                    </p>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Người nhận hỗ trợ: </span>
                                        {
                                            confirmedOrganizationDonors.length
                                        }{" "}
                                        người
                                    </p>
                                </div>
                            </div>
                            <div className="ls3r1c2c2">
                                <div className="ls3r1c2-item">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <PersonalIcon className="ls3r1c2-item-icon" />
                                        <p className="ls3r1c2-item-title">
                                            Cá nhân
                                        </p>
                                    </div>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Cá nhân đồng hành: </span>
                                        {confirmedPersonalDonors.length} cá nhân
                                    </p>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Chiến dịch diễn ra: </span>
                                        {personalCampaigns.length} chiến dịch
                                    </p>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Tổng số phần quà: </span>
                                        {totalPersonalLimitedQuantity} phần quà
                                    </p>
                                    <p className="ls3r1c2-item-quantity">
                                        <span>Người nhận hỗ trợ: </span>
                                        {
                                            confirmedOrganizationDonors.length
                                        }{" "}
                                        người
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section id="landing-s4" className="landing-section">
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
            </section> */}
            <section id="landing-s5" className="landing-section">
                <div className="landing-container ls5-container">
                    <div className="ls5cr1">
                        <h2>
                            <span>Tin tức </span>thiện nghiện
                        </h2>
                        <Link to={routes.user.news.list} className="view-all">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="ls5cr2">
                        <div className="ls5cr2c1">
                            {sortedNews?.[0] && (
                                <EventCard
                                    type={1}
                                    news={sortedNews[0]}
                                    onClickDetail={() =>
                                        handleToDetailNews(sortedNews[0].newId)
                                    }
                                />
                            )}
                        </div>
                        <div className="ls5cr2c2">
                            {sortedNews.slice(1, 6).map((item, index) => (
                                <EventCard key={index} type={2} news={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
