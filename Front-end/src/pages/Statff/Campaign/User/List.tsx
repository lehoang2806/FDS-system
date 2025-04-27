import { selectGetAllCampaign } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActiveIcon, ArrowLeft, ArrowRight, BlockIcon, TotalIcon } from '@/assets/icons'
import { Loading } from '@/components/Elements'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk'
import { FC, useEffect, useState } from 'react'

const StaffListCampaignUserPage: FC = () => {
    const dispatch = useAppDispatch()

    const [isFiltering, setIsFiltering] = useState(false);

    const handleToDetail = (campaignId: string) => {
        const url = routes.staff.campaign.user.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    const campaigns = useAppSelector(selectGetAllCampaign)
    const sortedCampaigns = [...campaigns].reverse();

    const userCampaigns = sortedCampaigns.filter(campaign => campaign.roleId === 3)

    const userRejectedCampaigns = userCampaigns.filter(campaign => campaign.status === "Rejected")

    const userApprovedCampaigns = userCampaigns.filter(campaign => campaign.status === "Approved")

    const userPendingCampaigns = userCampaigns.filter(campaign => campaign.status === "Pending")

    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const handleFilter = (status: string | null) => {
        setIsFiltering(true);
        setTimeout(() => {
            setFilterStatus(status);
            setIsFiltering(false);
        }, 500);
    };

    const filteredCampaigns = filterStatus
        ? userCampaigns.filter((c) => c.status === filterStatus)
        : userCampaigns;


    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, []);

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
        <section id="staff-list-campaign-user" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />}
            <div className="staff-container slcu-container">
                <div className="slcucr1">
                    <h1>Người hiến tặng thực phẩm</h1>
                    <p>Trang tổng quát<span className="staff-tag">Danh sách chiến dịch</span></p>
                </div>
                <div className="slcucr2">
                    <div className="staff-tab staff-tab-1" onClick={() => handleFilter(null)}>
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Tất cả</h3>
                            <p>{userCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2" onClick={() => handleFilter("Rejected")}>
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Bị từ chối</h3>
                            <p>{userRejectedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3" onClick={() => handleFilter("Approved")}>
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Đã phê duyệt</h3>
                            <p>{userApprovedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Chờ phê duyệt</h3>
                            <p>{userPendingCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                </div>

                <div className="slcucr3">
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

export default StaffListCampaignUserPage