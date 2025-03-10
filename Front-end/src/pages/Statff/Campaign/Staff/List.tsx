import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { FC } from 'react'

const StaffListCampaignStaffPage: FC = () => {
    const handleToDetail = (campaignId: string) => {
        const url = routes.staff.campaign.staff.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <section id="staff-list-campaign-staff" className="staff-section">
            <div className="staff-container slcs-container">
                <div className="slcscr1">
                    <h1>Staff's Campain</h1>
                    <p>Dashboard<span className="staff-tag">Staff's Campaign</span></p>
                </div>
                <div className="slcscr2">
                    <div className="staff-tab staff-tab-1">
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Total</h3>
                            <p>7 Campaigns</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2">
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Reject</h3>
                            <p>7 Campaigns</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3">
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Approve</h3>
                            <p>7 Campaigns</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4">
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Pending</h3>
                            <p>7 Campaigns</p>
                        </div>
                    </div>
                </div>
                <div className="slcscr3">
                    <button className="staff-add-btn" onClick={() => navigateHook(routes.staff.campaign.staff.add)}>Add Campaign</button>
                </div>
                <div className="slcscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    ID
                                </th>
                                <th className="table-head-cell">
                                    Name
                                </th>
                                <th className="table-head-cell">
                                    Creste Dste
                                </th>
                                <th className="table-head-cell">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            <tr className="table-body-row">
                                <td className='table-body-cell'>1</td>
                                <td className='table-body-cell'>A</td>
                                <td className='table-body-cell'>7/1</td>
                                <td className="table-body-cell">
                                    <button className='view-btn' onClick={() => handleToDetail('1')}>View</button>
                                </td>
                            </tr>
                            <tr className="table-body-row">
                                <td className='table-body-cell'>1</td>
                                <td className='table-body-cell'>A</td>
                                <td className='table-body-cell'>7/1</td>
                                <td className="table-body-cell">
                                    <button className='view-btn' onClick={() => handleToDetail('1')}>View</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default StaffListCampaignStaffPage