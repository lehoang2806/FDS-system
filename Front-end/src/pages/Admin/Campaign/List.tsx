import { selectGetAllCampaign } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk'
import { FC, useEffect } from 'react'

const AdminListCampaignPage: FC = () => {
    const dispatch = useAppDispatch()

    const campaigns = useAppSelector(selectGetAllCampaign)

    const staffCampaigns = campaigns.filter(campaign => campaign.roleId === 2)

    console.log(staffCampaigns)

    useEffect(() => {
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
            });
    }, []);

    const handleToDetail = (campaignId: string) => {
        const url = routes.admin.campaign.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <section id="admin-list-campaign" className="admin-section">
            <div className="admin-container alc-container">
                <div className="alccr1">
                    <h1>Campain</h1>
                    <p>Dashboard<span className="admin-tag">Campaign</span></p>
                </div>
                <div className="alccr2">
                    <div className="admin-tab admin-tab-1">
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Total</h3>
                            <p>7 Campaigns</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-2">
                        <div className="at-figure at-figure-2">
                            <BlockIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Reject</h3>
                            <p>7 Campaigns</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-3">
                        <div className="at-figure at-figure-3">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Approve</h3>
                            <p>7 Campaigns</p>
                        </div>
                    </div>
                </div>
                <div className="alccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Campaign Name
                                </th>
                                <th className="table-head-cell">
                                    Address
                                </th>
                                <th className="table-head-cell">
                                    Receive Date
                                </th>
                                <th className="table-head-cell">
                                    Description
                                </th>
                                <th className="table-head-cell">
                                    Gift Quantity
                                </th>
                                <th className="table-head-cell">
                                    Gift Type
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
                            {staffCampaigns.map((campaign, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>{campaign.nameCampaign}</td>
                                    <td className='table-body-cell'>{campaign.address}</td>
                                    <td className='table-body-cell'>{campaign.receiveDate}</td>
                                    <td className='table-body-cell'>{campaign.description}</td>
                                    <td className='table-body-cell'>{campaign.giftQuantity}</td>
                                    <td className='table-body-cell'>{campaign.giftType}</td>
                                    <td className='table-body-cell'>{campaign.status === "Pending" ? <span className='status-pending'>Pending</span> : campaign.status === "Approved" ? <span className='status-approved'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
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

export default AdminListCampaignPage