import { selectGetAllCampaign } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk'
import { FC, useEffect } from 'react'

const AdminListCampaignPage: FC = () => {
    const dispatch = useAppDispatch()

    const campaigns = useAppSelector(selectGetAllCampaign)

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
        const url = routes.admin.campaign.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <section id="admin-list-campaign" className="admin-section">
            <div className="admin-container alc-container">
                <div className="alccr1">
                    <h1>Chiến dịch</h1>
                    <p>Trang tổng quan<span className="admin-tag">Chiến dịch</span></p>
                </div>
                <div className="alccr2">
                    <div className="admin-tab admin-tab-1">
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Tổng cộng</h3>
                            <p>7 Chiến dịch</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-2">
                        <div className="at-figure at-figure-2">
                            <BlockIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Bị từ chối</h3>
                            <p>7 Chiến dịch</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-3">
                        <div className="at-figure at-figure-3">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Được phê duyệt</h3>
                            <p>7 Chiến dịch</p>
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
                            {campaigns.map((campaign, index) => (
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

export default AdminListCampaignPage