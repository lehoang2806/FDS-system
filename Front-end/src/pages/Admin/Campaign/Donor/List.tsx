import { selectGetAllCampaign } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActiveIcon, ArrowLeft, ArrowRight, BlockIcon, TotalIcon } from '@/assets/icons'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk'
import { FC, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { Loading } from '@/components/Elements'

dayjs.locale('vi');
dayjs.extend(relativeTime);

const AdminListCampaignUserPage: FC = () => {
    const dispatch = useAppDispatch()

    const campaigns = useAppSelector(selectGetAllCampaign)
    const sortedCampaigns = [...campaigns].reverse();
    const userCampaigns = sortedCampaigns.filter(campaign => campaign.roleId === 3)

    const rejectedCampaigns = userCampaigns.filter(campaign => campaign.status === "Rejected")

    const approvedCampaigns = userCampaigns.filter(campaign => campaign.status === "Approved")

    const pendingCampaigns = userCampaigns.filter(campaign => campaign.status === "Pending")

    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);

    const handleFilter = (status: string | null) => {
        setIsFiltering(true);
        setTimeout(() => {
            setFilterStatus(status);
            setIsFiltering(false);
        }, 500);
    };

    const filteredCampaigns = filterStatus
        ? sortedCampaigns.filter((c) => c.status === filterStatus)
        : sortedCampaigns;

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch]);

    const handleToDetail = (campaignId: string) => {
        const url = routes.admin.campaign.donor.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    const ITEMS_PER_PAGE = 5;

    const [currentCampaignPage, setCurrentCampaignPage] = useState(1);

    const totalCampaignPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);

    const currentCampaignsPage = filteredCampaigns.slice(
        (currentCampaignPage - 1) * ITEMS_PER_PAGE,
        currentCampaignPage * ITEMS_PER_PAGE
    );

    const onPreviousCampaignPage = () => {
        if (currentCampaignPage > 1) setCurrentCampaignPage(currentCampaignPage - 1);
    };

    const onNextCampaignPage = () => {
        if (currentCampaignPage < totalCampaignPages) setCurrentCampaignPage(currentCampaignPage + 1);
    };

    return (
        <section id="admin-list-campaign-donor" className="admin-section">
            {isFiltering && <Loading loading={true} isFullPage />}
            <div className="admin-container alcd-container">
                <div className="alcdcr1">
                    <h1>Chiến dịch</h1>
                    <p>Trang tổng quan<span className="admin-tag">Chiến dịch</span></p>
                </div>
                <div className="alcdcr2">
                    <div className="admin-tab admin-tab-1" onClick={() => handleFilter(null)}>
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Tất cả</h3>
                            <p>{sortedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-2" onClick={() => handleFilter("Rejected")}>
                        <div className="at-figure at-figure-2">
                            <BlockIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Bị từ chối</h3>
                            <p>{rejectedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-3" onClick={() => handleFilter("Approved")}>
                        <div className="at-figure at-figure-3">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Đã phê duyệt</h3>
                            <p>{approvedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="at-figure at-figure-4">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Chờ phê duyệt</h3>
                            <p>{pendingCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                </div>
                <div className="alcdcr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Tên chiến dịch
                                </th>
                                <th className="table-head-cell">
                                    Trạng thái
                                </th>
                                <th className="table-head-cell">
                                    Thời gian tạo
                                </th>
                                <th className="table-head-cell">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {currentCampaignsPage.map((campaign, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>{campaign.campaignName}</td>
                                    <td className='table-body-cell'>
                                        {campaign.status === "Pending" ? (
                                            <span className='status-pending'>Đang chờ phê duyệt</span>
                                        ) : campaign.status === "Approved" ? (
                                            <span className='status-approve'>Đã được phê duyệt</span>
                                        ) : campaign.status === "Rejected" ? (
                                            <span className='status-reject'>Đã bị từ chối</span>
                                        ) : campaign.status === "Canceled" ? (
                                            <span className='status-reject'>Đã huỷ</span>
                                        ) : null}
                                    </td>
                                    <td className='table-body-cell'>
                                        {campaign?.createdDate ? dayjs(campaign.createdDate).fromNow() : ''}
                                    </td>
                                    <td className="table-body-cell">
                                        <button className='view-btn' onClick={() => handleToDetail(campaign.campaignId)}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='paginator'>
                        <div className="p-container">
                            <div className="pcc2">{currentCampaignPage} of {totalCampaignPages}</div>
                            <div className="pcc3">
                                <button disabled={currentCampaignPage === 1} onClick={onPreviousCampaignPage}>
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={currentCampaignPage >= totalCampaignPages}
                                    onClick={onNextCampaignPage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${currentCampaignPage >= totalCampaignPages ? 'pcc3-icon-disabled' : ''}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminListCampaignUserPage