import { selectGetAllCampaign } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons'
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

    const userCampaigns = campaigns.filter(campaign => campaign.roleId === 3)

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

    return (
        <section id="staff-list-campaign-user" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />} 
            <div className="staff-container slcu-container">
                <div className="slcucr1">
                    <h1>User's Campain</h1>
                    <p>Dashboard<span className="staff-tag">User's Campaign</span></p>
                </div>
                <div className="slcucr2">
                    <div className="staff-tab staff-tab-1" onClick={() => handleFilter(null)}>
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Total</h3>
                            <p>{userCampaigns.length} Campaigns</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2" onClick={() => handleFilter("Rejected")}>
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Reject</h3>
                            <p>{userRejectedCampaigns.length} Campaigns</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3" onClick={() => handleFilter("Approved")}>
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Approve</h3>
                            <p>{userApprovedCampaigns.length} Campaigns</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Pending</h3>
                            <p>{userPendingCampaigns.length} Campaigns</p>
                        </div>
                    </div>
                </div>

                <div className="slcucr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Campaign Name
                                </th>
                                <th className="table-head-cell">
                                    Description
                                </th>
                                <th className="table-head-cell">
                                    Status
                                </th>
                                <th className="table-head-cell">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {filteredCampaigns.map((campaign, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>{campaign.campaignName}</td>
                                    <td className='table-body-cell'>{campaign.campaignDescription}</td>
                                    <td className='table-body-cell'>{campaign.status === "Pending" ? <span className='status-pending'>Pending</span> : campaign.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                    <td className="table-body-cell">
                                        <button className='view-btn' onClick={() => handleToDetail(campaign.campaignId)}>View</button>
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

export default StaffListCampaignUserPage