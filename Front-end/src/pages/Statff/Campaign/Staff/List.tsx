import { selectGetAllCampaign } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActiveIcon, BlockIcon, PendingIcon, TotalIcon } from '@/assets/icons'
import { Loading } from '@/components/Elements'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk'
import { FC, useEffect, useState } from 'react'

const StaffListCampaignStaffPage: FC = () => {
    const dispatch = useAppDispatch()

    const handleToDetail = (campaignId: string) => {
        const url = routes.staff.campaign.staff.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    const campaigns = useAppSelector(selectGetAllCampaign);
    const sortedCampaigns = [...campaigns].reverse();

    const staffCampaigns = sortedCampaigns.filter(campaign => campaign.roleId === 2)

    const staffRejectedCampaigns = staffCampaigns.filter(campaign => campaign.status === "Rejected")

    const staffApprovedCampaigns = staffCampaigns.filter(campaign => campaign.status === "Approved")

    const staffPendingCampaigns = staffCampaigns.filter(campaign => campaign.status === "Pending")

    const [isFiltering, setIsFiltering] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const handleFilter = (status: string | null) => {
        setIsFiltering(true);
        setTimeout(() => {
            setFilterStatus(status);
            setIsFiltering(false);
        }, 500);
    };

    const filteredCampaigns = filterStatus
        ? staffCampaigns.filter((c) => c.status === filterStatus)
        : staffCampaigns;

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

    return (
        <section id="staff-list-campaign-staff" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />} 
            <div className="staff-container slcs-container">
                <div className="slcscr1">
                    <h1>Chiến dịch của nhân viên</h1>
                    <p>Trang tổng quát<span className="staff-tag">Chiến dịch của nhân viên</span></p>
                </div>
                <div className="slcscr2">
                    <div className="staff-tab staff-tab-1" onClick={() => handleFilter(null)}>
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Tất cả</h3>
                            <p>{staffCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2" onClick={() => handleFilter("Rejected")}>
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Đã bị từ chối</h3>
                            <p>{staffRejectedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3" onClick={() => handleFilter("Approved")}>
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Đã phê duyệt</h3>
                            <p>{staffApprovedCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="st-figure st-figure-4">
                            <PendingIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Chờ phê duyệt</h3>
                            <p>{staffPendingCampaigns.length} Chiến dịch</p>
                        </div>
                    </div>
                </div>
                <div className="slcscr3">
                    <button className="staff-add-btn" onClick={() => navigateHook(routes.staff.campaign.staff.add)}>Tạo chiến dịch</button>
                </div>
                <div className="slcscr4">
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
                            {filteredCampaigns.map((campaign, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>{campaign.campaignName}</td>
                                    <td className='table-body-cell'>{campaign.status === "Pending" ? <span className='status-pending'>Đang chờ phê duyệt</span> : campaign.status === "Approved" ? <span className='status-approve'>Đã được phê duyệt</span> : <span className='status-reject'>Đã bị từ chối</span>}</td>
                                    <td className="table-body-cell">
                                        <button className='view-btn' onClick={() => handleToDetail(campaign.campaignId)}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default StaffListCampaignStaffPage