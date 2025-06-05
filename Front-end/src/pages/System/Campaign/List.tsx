import { selectGetAllCampaign } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { RightIcon, SearchIcon } from "@/assets/icons";
import { CampaignCard } from "@/components/Card/index";
import { Loading } from "@/components/Elements";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { CampaignInfo } from "@/types/campaign";

const ListCampaignPage: FC = () => {
    const dispatch = useAppDispatch();

    const handleToDetail = (campaignId: string) => {
        const url = routes.user.campaign.detail.replace(":id", campaignId);
        return navigateHook(url);
    };

    const campaigns = useAppSelector(selectGetAllCampaign);
    const sortedCampaigns = [...campaigns].reverse();

    const approvedCampaigns = sortedCampaigns.filter(
        (campaign) => campaign.status === "Approved"
    );

    const personalCampaigns = approvedCampaigns.filter(
        (campaign) => campaign.typeAccount === "Personal Donor"
    );

    const organizationCampaigns = approvedCampaigns.filter(
        (campaign) => campaign.typeAccount === "Organization Donor"
    );

    const [isSelectTypeOpen, setIsSelectTypeOpen] = useState(false);

    // All Campaigns
    const [dateRangeAllCampaigns, setDateRangeAllCampaigns] = useState({
        from: "",
        to: "",
    });

    // Personal Campaigns
    const [dateRangePersonalCampaigns, setDateRangePersonalCampaigns] =
        useState({ from: "", to: "" });

    // Organization Campaigns
    const [dateRangeOrganizationCampaigns, setDateRangeOrganizationCampaigns] =
        useState({ from: "", to: "" });

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);

    const location = useLocation();
    const navigate = useNavigate();

    const getActiveTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return Number(params.get("tab")) || 0;
    };

    const [activeTab, setActiveTab] = useState<number>(getActiveTabFromURL());

    const resetFiltersByTab = (tabIndex: number) => {
        setSearchTerm("");
        setStatusFilter("");

        // Reset từng date range đúng với tab
        if (tabIndex === 0) {
            setDateRangeAllCampaigns({ from: "", to: "" });
            setDateRangePersonalCampaigns({ from: "", to: "" });
            setDateRangeOrganizationCampaigns({ from: "", to: "" });
            setVisibleAllCampaignsCount(6);
        } else if (tabIndex === 1) {
            setDateRangeAllCampaigns({ from: "", to: "" });
            setDateRangePersonalCampaigns({ from: "", to: "" });
            setDateRangeOrganizationCampaigns({ from: "", to: "" });
            setVisiblePersonalCampaignsCount(6);
        } else if (tabIndex === 2) {
            setDateRangeAllCampaigns({ from: "", to: "" });
            setDateRangePersonalCampaigns({ from: "", to: "" });
            setDateRangeOrganizationCampaigns({ from: "", to: "" });
            setVisibleOrganizationCampaignsCount(6);
        }
    };

    const handleTabChange = (tabIndex: number) => {
        resetFiltersByTab(tabIndex); // 👈 Reset bộ lọc
        setActiveTab(tabIndex);
        navigate(`?tab=${tabIndex}`);
    };

    useEffect(() => {
        const tab = getActiveTabFromURL();
        setActiveTab(tab);
        resetFiltersByTab(tab); // 👈 Reset lại filter khi reload với URL có ?tab
    }, [location.search]);

    //All campaigns
    const [visibleAllCampaignsCount, setVisibleAllCampaignsCount] = useState(6);

    const handleShowMoreAllcampaigns = () => {
        setVisibleAllCampaignsCount((prev) => prev + 6);
    };

    //Personal campaigns
    const [visiblePersonalCampaignsCount, setVisiblePersonalCampaignsCount] =
        useState(6);

    const handleShowMorePersonalCampaigns = () => {
        setVisiblePersonalCampaignsCount((prev) => prev + 6);
    };

    //Organization campaigns
    const [
        visibleOrganizationCampaignsCount,
        setVisibleOrganizationCampaignsCount,
    ] = useState(6);

    const handleShowMoreOrganizationCampaigns = () => {
        setVisibleOrganizationCampaignsCount((prev) => prev + 6);
    };

    //Load
    const [isFiltering, setIsFiltering] = useState(false);

    const handleFilter = () => {
        setIsFiltering(true);
        setTimeout(() => {
            setIsFiltering(false);
        }, 1000);
    };

    //Search
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filterCampaignsByDateRange = (
        campaigns: CampaignInfo[],
        from: string,
        to: string
    ) => {
        if (!from && !to) return campaigns;

        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        return campaigns.filter((campaign) => {
            const campaignDate = new Date(
                campaign.implementationTime.split("T")[0]
            );

            if (fromDate && toDate) {
                return campaignDate >= fromDate && campaignDate <= toDate;
            }
            if (fromDate) {
                return campaignDate >= fromDate;
            }
            if (toDate) {
                return campaignDate <= toDate;
            }

            return true;
        });
    };

    //Filter Status
    const [statusFilter, setStatusFilter] = useState<string>(""); // '', 'ongoing', 'ended'

    const filterByStatus = (campaigns: CampaignInfo[]) => {
        if (!statusFilter) return campaigns;

        const now = new Date();

        return campaigns.filter((campaign) => {
            const implementation = new Date(campaign.implementationTime);
            const campaignEndOfDay = new Date(implementation);
            campaignEndOfDay.setHours(23, 59, 59, 999);

            if (statusFilter === "upcoming") {
                return campaignEndOfDay >= now;
            }

            if (statusFilter === "ended") {
                return campaignEndOfDay < now;
            }

            return true;
        });
    };

    const matchSearchTerm = (campaign: CampaignInfo, term: string) => {
        const keyword = term.toLowerCase();
        return (
            campaign.campaignName.toLowerCase().includes(keyword) ||
            campaign.location?.toLowerCase().includes(keyword) ||
            campaign.district?.toLowerCase().includes(keyword)
        );
    };

    // Filter All Campaigns
    const filteredAllCampaigns = filterByStatus(
        filterCampaignsByDateRange(
            approvedCampaigns,
            dateRangeAllCampaigns.from,
            dateRangeAllCampaigns.to
        )
    ).filter((campaign) => matchSearchTerm(campaign, searchTerm));

    const visibleFilteredAllCampaigns = filteredAllCampaigns.slice(
        0,
        visibleAllCampaignsCount
    );

    // Filter Personal Campaigns
    const filteredPersonalCampaigns = filterByStatus(
        filterCampaignsByDateRange(
            personalCampaigns,
            dateRangeAllCampaigns.from,
            dateRangeAllCampaigns.to
        )
    ).filter((campaign) => matchSearchTerm(campaign, searchTerm));

    const visibleFilteredPersonalCampaigns = filteredPersonalCampaigns.slice(
        0,
        visiblePersonalCampaignsCount
    );

    // Filter Organization Campaigns
    const filteredOrganizationCampaigns = filterByStatus(
        filterCampaignsByDateRange(
            organizationCampaigns,
            dateRangeAllCampaigns.from,
            dateRangeAllCampaigns.to
        )
    ).filter((campaign) => matchSearchTerm(campaign, searchTerm));

    const visibleFilteredOrganizationCampaigns =
        filteredOrganizationCampaigns.slice(
            0,
            visibleOrganizationCampaignsCount
        );

    return (
        <main id="campaigns">
            <section id="campains-section">
                <div className="cs-container">
                    <div className="cscr1">
                        <h1>Danh sách chiến dịch gây quỹ</h1>
                        <div className="cs-tabs">
                            <h2
                                className={`cs-tab ${
                                    activeTab === 0 ? "cs-tab-active" : ""
                                }`}
                                onClick={() => {
                                    handleTabChange(0);
                                    handleFilter();
                                }}
                            >
                                Tất cả
                            </h2>
                            <h2
                                className={`cs-tab ${
                                    activeTab === 1 ? "cs-tab-active" : ""
                                }`}
                                onClick={() => {
                                    handleTabChange(1);
                                    handleFilter();
                                }}
                            >
                                Cá nhân
                            </h2>
                            <h2
                                className={`cs-tab ${
                                    activeTab === 2 ? "cs-tab-active" : ""
                                }`}
                                onClick={() => {
                                    handleTabChange(2);
                                    handleFilter();
                                }}
                            >
                                Tổ chức
                            </h2>
                        </div>
                    </div>
                    {isFiltering && <Loading loading={true} isFullPage />}
                    <div className="cscr2">
                        <div className="cscr2r1">
                            <div className="cscr2r1r1">
                                <div className="form">
                                    <label className="form-label">
                                        Trạng thái:
                                    </label>
                                    <div className="form-input-select-container">
                                        <select
                                            className="form-input-select form-input"
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value)
                                            }
                                            onClick={() =>
                                                setIsSelectTypeOpen(
                                                    !isSelectTypeOpen
                                                )
                                            }
                                        >
                                            <option
                                                value=""
                                                onClick={() =>
                                                    setIsSelectTypeOpen(
                                                        isSelectTypeOpen ===
                                                            false
                                                    )
                                                }
                                            >
                                                Tất cả
                                            </option>
                                            <option
                                                value="upcoming"
                                                onClick={() =>
                                                    setIsSelectTypeOpen(
                                                        isSelectTypeOpen ===
                                                            false
                                                    )
                                                }
                                            >
                                                Sắp diễn ra
                                            </option>
                                            <option
                                                value="ended"
                                                onClick={() =>
                                                    setIsSelectTypeOpen(
                                                        isSelectTypeOpen ===
                                                            false
                                                    )
                                                }
                                            >
                                                Đã kết thúc
                                            </option>
                                        </select>
                                        <RightIcon
                                            className={classNames(
                                                "form-icon-select",
                                                {
                                                    "rotate-45":
                                                        isSelectTypeOpen ===
                                                        true,
                                                }
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="cscr2r1r3">
                                {activeTab === 0 && (
                                    <div
                                        className="form date-filter-container"
                                        key={`all-date-${dateRangeAllCampaigns.from}-${dateRangeAllCampaigns.to}`}
                                    >
                                        <div className="form-field">
                                            <label className="form-label">
                                                Từ ngày:
                                            </label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={
                                                    dateRangeAllCampaigns.from ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setDateRangeAllCampaigns(
                                                        (prev) => ({
                                                            ...prev,
                                                            from: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">
                                                Đến ngày:
                                            </label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={
                                                    dateRangeAllCampaigns.to ||
                                                    ""
                                                }
                                                min={
                                                    dateRangeAllCampaigns.from ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setDateRangeAllCampaigns(
                                                        (prev) => ({
                                                            ...prev,
                                                            to: e.target.value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 1 && (
                                    <div
                                        className="form date-filter-container"
                                        key={`personal-date-${dateRangePersonalCampaigns.from}-${dateRangePersonalCampaigns.to}`}
                                    >
                                        <div className="form-field">
                                            <label className="form-label">
                                                Từ ngày:
                                            </label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={
                                                    dateRangePersonalCampaigns.from ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setDateRangePersonalCampaigns(
                                                        (prev) => ({
                                                            ...prev,
                                                            from: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">
                                                Đến ngày:
                                            </label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={
                                                    dateRangePersonalCampaigns.to ||
                                                    ""
                                                }
                                                min={
                                                    dateRangePersonalCampaigns.from ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setDateRangePersonalCampaigns(
                                                        (prev) => ({
                                                            ...prev,
                                                            to: e.target.value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 2 && (
                                    <div
                                        className="form date-filter-container"
                                        key={`org-date-${dateRangeOrganizationCampaigns.from}-${dateRangeOrganizationCampaigns.to}`}
                                    >
                                        <div className="form-field">
                                            <label className="form-label">
                                                Từ ngày:
                                            </label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={
                                                    dateRangeOrganizationCampaigns.from ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setDateRangeOrganizationCampaigns(
                                                        (prev) => ({
                                                            ...prev,
                                                            from: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">
                                                Đến ngày:
                                            </label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={
                                                    dateRangeOrganizationCampaigns.to ||
                                                    ""
                                                }
                                                min={
                                                    dateRangeOrganizationCampaigns.from ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setDateRangeOrganizationCampaigns(
                                                        (prev) => ({
                                                            ...prev,
                                                            to: e.target.value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="cscr2r1r2">
                                <div className="form campaign-search-container">
                                    <label className="form-label">
                                        Tìm kiếm:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input campaign-search-input"
                                        placeholder="Tìm kiếm tên chiến dịch, địa điểm nhận quà"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                    <SearchIcon className="campaign-search-icon" />
                                </div>
                            </div>
                        </div>
                        <div className="cscr2r2">
                            {activeTab === 0 &&
                                (filteredAllCampaigns.length > 0 ? (
                                    <>
                                        <div className="cscr2r2-list">
                                            {visibleFilteredAllCampaigns.map(
                                                (campaign) => (
                                                    <CampaignCard
                                                        campaign={campaign}
                                                        key={
                                                            campaign.campaignId
                                                        }
                                                        onClickDetail={() =>
                                                            handleToDetail(
                                                                campaign.campaignId
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>

                                        {filteredAllCampaigns.length >
                                            visibleAllCampaignsCount && (
                                            <button
                                                className="view-more"
                                                onClick={
                                                    handleShowMoreAllcampaigns
                                                }
                                            >
                                                Xem thêm
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <h1>Chưa có dữ liệu</h1>
                                ))}

                            {activeTab === 1 &&
                                (filteredPersonalCampaigns.length > 0 ? (
                                    <>
                                        <div className="cscr2r2-list">
                                            {visibleFilteredPersonalCampaigns.map(
                                                (campaign) => (
                                                    <CampaignCard
                                                        campaign={campaign}
                                                        key={
                                                            campaign.campaignId
                                                        }
                                                        onClickDetail={() =>
                                                            handleToDetail(
                                                                campaign.campaignId
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>

                                        {filteredPersonalCampaigns.length >
                                            visiblePersonalCampaignsCount && (
                                            <button
                                                className="view-more"
                                                onClick={
                                                    handleShowMorePersonalCampaigns
                                                }
                                            >
                                                Xem thêm
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <h1>Chưa có dữ liệu</h1>
                                ))}

                            {activeTab === 2 &&
                                (filteredOrganizationCampaigns.length > 0 ? (
                                    <>
                                        <div className="cscr2r2-list">
                                            {visibleFilteredOrganizationCampaigns.map(
                                                (campaign) => (
                                                    <CampaignCard
                                                        campaign={campaign}
                                                        key={
                                                            campaign.campaignId
                                                        }
                                                        onClickDetail={() =>
                                                            handleToDetail(
                                                                campaign.campaignId
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>

                                        {filteredOrganizationCampaigns.length >
                                            visibleOrganizationCampaignsCount && (
                                            <button
                                                className="view-more"
                                                onClick={
                                                    handleShowMoreOrganizationCampaigns
                                                }
                                            >
                                                Xem thêm
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <h1>Chưa có dữ liệu</h1>
                                ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ListCampaignPage;
