import { selectGetAllCampaign } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons'
import { RejectCampaignModal, RejectReasonModal } from '@/components/Modal'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { approveCampaignApiThunk, getAllCampaignApiThunk } from '@/services/campaign/campaignThunk'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const AdminListCampaignPage: FC = () => {
    const dispatch = useAppDispatch()

    const campaigns = useAppSelector(selectGetAllCampaign)

    const [selectedCampaign, setSelectedCampaign] = useState<RejectCampaign | null>(null);

    const [selectedReason, setSelectReason] = useState<string | null>('');

    const [isRejectCampaignModalOpen, setIsRejectCampaignModalOpen] = useState(false);

    const [isRejectReasonModalOpen, setIsRejectReasonModalOpen] = useState(false);

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

    const handleApproveCampaign = async (values: ApproveCampaign) => {
        try {
            await dispatch(approveCampaignApiThunk(values)).unwrap();
            toast.success("Approve Campaign Successfully");
            dispatch(getAllCampaignApiThunk());
        } catch (error) {
            console.error("Error in approval process:", error);
            toast.error("An error occurred while approving the certificate.");
        }
    };


    const handleRejectCampaign = (campaignId: string) => {
        setSelectedCampaign({ campaignId, comment: "" });
        setIsRejectCampaignModalOpen(true);
    };

    const handleViewReason = (comment: string | null) => {
        setSelectReason(comment);
        setIsRejectReasonModalOpen(true);
    };

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
                                    <td className='table-body-cell'>{campaign.nameCampaign}</td>
                                    <td className='table-body-cell'>{campaign.address}</td>
                                    <td className='table-body-cell'>{campaign.receiveDate}</td>
                                    <td className='table-body-cell'>{campaign.description}</td>
                                    <td className='table-body-cell'>{campaign.status === "Pending" ? <span className='status-pending'>Pending</span> : campaign.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                    <td className="table-body-cell">
                                        <button className='view-btn' onClick={() => handleToDetail(campaign.campaignId)}>View</button>
                                        {campaign.status === "Pending" && (
                                            <>
                                                <button className='approve-btn' onClick={() => handleApproveCampaign({ campaignId: campaign.campaignId })}>Approve</button>
                                                <button className='reject-btn' onClick={() => handleRejectCampaign(campaign.campaignId)}>Reject</button>
                                            </>
                                        )}
                                        {campaign.status === "Rejected" && <button className='reject-btn' onClick={() => handleViewReason(campaign.rejectComment)}>View Reason</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <RejectCampaignModal isOpen={isRejectCampaignModalOpen} setIsOpen={setIsRejectCampaignModalOpen} selectedCampaign={selectedCampaign} />
            <RejectReasonModal isOpen={isRejectReasonModalOpen} setIsOpen={setIsRejectReasonModalOpen} reason={selectedReason} />
        </section>
    )
}

export default AdminListCampaignPage