import { selectGetAllCampaign } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
    ActiveIcon,
    ArrowLeft,
    ArrowRight,
    BlockIcon,
    TotalIcon,
} from "@/assets/icons";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { Loading } from "@/components/Elements";

dayjs.locale("vi");
dayjs.extend(relativeTime);

const AdminListCampaignPage: FC = () => {
    const dispatch = useAppDispatch();

    const campaigns = useAppSelector(selectGetAllCampaign);
    const sortedCampaigns = [...campaigns].reverse();

    const rejectedCampaigns = sortedCampaigns.filter(
        (campaign) => campaign.status === "Rejected"
    );

    const approvedCampaigns = sortedCampaigns.filter(
        (campaign) => campaign.status === "Approved"
    );

    const pendingCampaigns = sortedCampaigns.filter(
        (campaign) => campaign.status === "Pending"
    );

    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [districtFilter, setDistrictFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleFilter = (status: string | null) => {
        setIsFiltering(true);
        setTimeout(() => {
            setFilterStatus(status);
            setIsFiltering(false);
        }, 500);
    };

    const filteredCampaigns = sortedCampaigns.filter((campaign) => {
        const matchesStatus = filterStatus
            ? campaign.status === filterStatus
            : true;

        const matchesSearch = searchTerm
            ? campaign.campaignName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            : true;

        const matchesDistrict = districtFilter
            ? campaign.district?.toLowerCase() === districtFilter.toLowerCase()
            : true;

        const matchesStartDate = startDate
            ? new Date(campaign.implementationTime) >= new Date(startDate)
            : true;

        const matchesEndDate = endDate
            ? new Date(campaign.implementationTime) <= new Date(endDate)
            : true;

        return (
            matchesStatus &&
            matchesSearch &&
            matchesDistrict &&
            matchesStartDate &&
            matchesEndDate
        );
    });

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

    useEffect(() => {
        setCurrentCampaignPage(1);
    }, [searchTerm, districtFilter, startDate, endDate, filterStatus]);

    const handleToDetail = (campaignId: string) => {
        const url = routes.admin.campaign.detail.replace(":id", campaignId);
        return navigateHook(url);
    };

    const ITEMS_PER_PAGE = 5;

    const [currentCampaignPage, setCurrentCampaignPage] = useState(1);

    const totalCampaignPages = Math.ceil(
        filteredCampaigns.length / ITEMS_PER_PAGE
    );

    const currentCampaignsPage = filteredCampaigns.slice(
        (currentCampaignPage - 1) * ITEMS_PER_PAGE,
        currentCampaignPage * ITEMS_PER_PAGE
    );

    const onPreviousCampaignPage = () => {
        if (currentCampaignPage > 1)
            setCurrentCampaignPage(currentCampaignPage - 1);
    };

    const onNextCampaignPage = () => {
        if (currentCampaignPage < totalCampaignPages)
            setCurrentCampaignPage(currentCampaignPage + 1);
    };

    return (
        <section id="admin-list-campaign" className="admin-section">
            {isFiltering && <Loading loading={true} isFullPage />}
            <div className="admin-container alc-container">
                <div className="alccr1">
                    <h1>Chiến dịch</h1>
                    <p>
                        Trang tổng quan
                        <span className="admin-tag">Chiến dịch</span>
                    </p>
                </div>
                <div className="alccr2">
                    <div
                        className="admin-tab admin-tab-1"
                        onClick={() => handleFilter(null)}
                    >
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Tất cả</h3>
                            <p>{sortedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div
                        className="admin-tab admin-tab-2"
                        onClick={() => handleFilter("Rejected")}
                    >
                        <div className="at-figure at-figure-2">
                            <BlockIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Bị từ chối</h3>
                            <p>{rejectedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div
                        className="admin-tab admin-tab-3"
                        onClick={() => handleFilter("Approved")}
                    >
                        <div className="at-figure at-figure-3">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Đã phê duyệt</h3>
                            <p>{approvedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div
                        className="admin-tab admin-tab-4"
                        onClick={() => handleFilter("Pending")}
                    >
                        <div className="at-figure at-figure-4">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Chờ phê duyệt</h3>
                            <p>{pendingCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                </div>
                <div className="alccr4">
                    <div className="alccr4c1">
                        <label>Tìm kiếm</label>
                        <input
                            type="text"
                            className="pr-input"
                            placeholder="Tìm kiếm tên chiến dịch"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="alccr4c2">
                        <label>Quận/ Huyện</label>
                        <select
                            className="pr-input"
                            value={districtFilter}
                            onChange={(e) => setDistrictFilter(e.target.value)}
                        >
                            <option value="">Chọn Quận/Huyện</option>
                            <option value="Hải Châu">Hải Châu</option>
                            <option value="Thanh Khê">Thanh Khê</option>
                            <option value="Sơn Trà">Sơn Trà</option>
                            <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
                            <option value="Liên Chiểu">Liên Chiểu</option>
                            <option value="Cẩm Lệ">Cẩm Lệ</option>
                            <option value="Hoà Vang">Hoà Vang</option>
                            <option value="Hoàng Sa">Hoàng Sa</option>
                        </select>
                    </div>
                    <div className="alccr4c3">
                        <label>Thời gian diễn ra</label>
                        <div className="group-input">
                            <input
                                type="date"
                                className="pr-input"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    // Reset endDate nếu nó đang nhỏ hơn startDate
                                    if (
                                        endDate &&
                                        new Date(e.target.value) >
                                            new Date(endDate)
                                    ) {
                                        setEndDate("");
                                    }
                                }}
                            />
                            -
                            <input
                                type="date"
                                className="pr-input"
                                value={endDate}
                                min={
                                    startDate
                                        ? new Date(
                                              new Date(startDate).getTime() +
                                                  86400000
                                          ) // +1 ngày
                                              .toISOString()
                                              .split("T")[0]
                                        : undefined
                                }
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="alccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Tên chiến dịch
                                </th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Thời gian tạo
                                </th>
                                <th className="table-head-cell">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {currentCampaignsPage.map((campaign, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className="table-body-cell">
                                        {campaign.campaignName}
                                    </td>
                                    <td className="table-body-cell">
                                        {campaign.status === "Pending" ? (
                                            <span className="status-pending">
                                                Đang chờ phê duyệt
                                            </span>
                                        ) : campaign.status === "Approved" ? (
                                            <span className="status-approve">
                                                Đã được phê duyệt
                                            </span>
                                        ) : campaign.status === "Rejected" ? (
                                            <span className="status-reject">
                                                Đã bị từ chối
                                            </span>
                                        ) : campaign.status === "Canceled" ? (
                                            <span className="status-reject">
                                                Đã huỷ
                                            </span>
                                        ) : null}
                                    </td>
                                    <td className="table-body-cell">
                                        {campaign?.createdDate
                                            ? dayjs(
                                                  campaign.createdDate
                                              ).fromNow()
                                            : ""}
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                handleToDetail(
                                                    campaign.campaignId
                                                )
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="paginator">
                        <div className="p-container">
                            <div className="pcc2">
                                {currentCampaignPage} of {totalCampaignPages}
                            </div>
                            <div className="pcc3">
                                <button
                                    disabled={currentCampaignPage === 1}
                                    onClick={onPreviousCampaignPage}
                                >
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={
                                        currentCampaignPage >=
                                        totalCampaignPages
                                    }
                                    onClick={onNextCampaignPage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${
                                            currentCampaignPage >=
                                            totalCampaignPages
                                                ? "pcc3-icon-disabled"
                                                : ""
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminListCampaignPage;
