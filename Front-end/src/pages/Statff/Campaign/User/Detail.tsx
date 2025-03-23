import { selectCurrentCampaign, selectGetAllRegisterReceivers } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { RejectCampaignModal } from '@/components/Modal';
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice';
import { approveCampaignApiThunk, getCampaignByIdApiThunk } from '@/services/campaign/campaignThunk';
import { getAllRegisterReceiversApiThunk } from '@/services/registerReceive/registerReceiveThunk';
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const StaffDetailCampaignUserPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const currentCampaign = useAppSelector(selectCurrentCampaign);

    const registerReceivers = useAppSelector(selectGetAllRegisterReceivers);

    const currentRegisterReceivers = registerReceivers.filter((registerReceiver) => registerReceiver.campaignId === id);

    const [selectedCampaign, setSelectedCampaign] = useState<RejectCampaign | null>(null);

    const [isRejectCampaignModalOpen, setIsRejectCampaignModalOpen] = useState(false);

    const date = currentCampaign?.receiveDate.split("T")[0];
    const time = currentCampaign?.receiveDate.split("T")[1].replace("Z", "");

    useEffect(() => {
        if (id) {
            dispatch(setLoading(true));
            dispatch(getAllRegisterReceiversApiThunk());
            dispatch(getCampaignByIdApiThunk(id))
                .unwrap()
                .catch(() => {
                }).finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                });
        }
    }, [id, dispatch])

    const handleApproveCampaign = async (values: ApproveCampaign) => {
        try {
            await dispatch(approveCampaignApiThunk(values)).unwrap();
            toast.success("Approve Campaign Successfully");
            dispatch(setLoading(true));
            dispatch(getCampaignByIdApiThunk(String(id)))
                .unwrap()
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                });
        } catch (error) {
            console.error("Error in approval process:", error);
            toast.error("An error occurred while approving the certificate.");
        }
    };


    const handleRejectCampaign = (campaignId: string) => {
        setSelectedCampaign({ campaignId, comment: "" });
        setIsRejectCampaignModalOpen(true);
    };

    return (
        <section id="staff-detail-campaign-user" className="staff-section">
            <div className="staff-container sdcu-container">
                <div className="sdcucr1">
                    <h1>User's Campain</h1>
                    <p>Dashboard<span className="staff-tag">Detail User's Campain</span></p>
                </div>
                <div className="sdcucr2">
                    <div className="sdcucr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.campaign.user.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcucr2r2">
                        <div className="sdcucr2r2c1">
                            <h3>Campaign Status:</h3>
                            <p>{currentCampaign?.status}</p>
                        </div>
                        <div className="sdcucr2r2c2">
                            <h3>Created Date:</h3>
                            <p>{currentCampaign?.dateCreated}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcucr2r3">
                        <div className="sdcucr2r3c1">
                            <h3>Campaign Name:</h3>
                            <p>{currentCampaign?.nameCampaign}</p>
                            <h3>Campaign Description:</h3>
                            <p>{currentCampaign?.description}</p>
                            <h3>Gift Quantity:</h3>
                            <p>{currentCampaign?.giftQuantity}</p>
                            <h3>Gift Type:</h3>
                            <p>{currentCampaign?.giftType}</p>
                        </div>
                        <div className="sdcucr2r3c2">
                            <h3>Receive Date:</h3>
                            <p>{date}</p>
                            <h3>Receive Time:</h3>
                            <p>{time}</p>
                        </div>
                    </div>
                    {currentCampaign?.status === "Pending" && (
                        <>
                            <button className='approve-btn' onClick={() => handleApproveCampaign({ campaignId: String(id) })}>Approve</button>
                            <button className='reject-btn' onClick={() => handleRejectCampaign(String(id))}>Reject</button>
                        </>
                    )}
                    {currentCampaign?.status === "Approved" && (
                        <div className="sdcucr2r3">
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">
                                            Name Receiver
                                        </th>
                                        <th className="table-head-cell">
                                            Quantity
                                        </th>
                                        <th className="table-head-cell">
                                            Register Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {currentRegisterReceivers.map((registerReceiver, index) => (
                                        <tr className="table-body-row" key={index}>
                                            <td className='table-body-cell'>{registerReceiver.registerReceiverName}</td>
                                            <td className='table-body-cell'>{registerReceiver.quantity}</td>
                                            <td className='table-body-cell'>{registerReceiver.creatAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {currentCampaign?.status === "Rejected" && (
                        <>
                            <h3>Reject Reason:</h3>
                            <p>{currentCampaign?.rejectComment}</p>
                        </>
                    )}
                </div>
            </div>
            <RejectCampaignModal isOpen={isRejectCampaignModalOpen} setIsOpen={setIsRejectCampaignModalOpen} selectedCampaign={selectedCampaign} />
        </section>
    )
}

export default StaffDetailCampaignUserPage