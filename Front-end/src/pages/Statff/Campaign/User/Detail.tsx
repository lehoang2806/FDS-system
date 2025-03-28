import { selectCurrentCampaign, selectGetAllRegisterReceivers } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { AdditionalCampaignModal, RejectCampaignModal } from '@/components/Modal';
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

    const [selectedRejectCampaign, setSelectedRejectCampaign] = useState<RejectCampaign | null>(null);

    const [selectedAdditionalCampaign, setSelectedAdditionalCampaign] = useState<AdditionalCampaign | null>(null);

    const [isRejectCampaignModalOpen, setIsRejectCampaignModalOpen] = useState(false);

    const [isAdditionalCampaignModalOpen, setIsAdditionalCampaignModalOpen] = useState(false);

    const date = currentCampaign?.implementationTime.split("T")[0];
    const time = currentCampaign?.implementationTime.split("T")[1].replace("Z", "");
    const dateCreate = currentCampaign?.createdDate.split("T")[0];

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
        setSelectedRejectCampaign({ campaignId, comment: "" });
        setIsRejectCampaignModalOpen(true);
    };

    const handleAdditionalCampaign = (campaignId: string) => {
        setSelectedAdditionalCampaign({ campaignId, content: "" });
        setIsAdditionalCampaignModalOpen(true);
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
                            <p>{dateCreate}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcucr2r3">
                        <div className="sdcucr2r3c1">
                            <h2>Campaign Information</h2>
                            <h3>Campaign Name:</h3>
                            <p>{currentCampaign?.campaignName}</p>
                            <h3>Campaign Description:</h3>
                            <p>{currentCampaign?.campaignDescription}</p>
                            <h3>Gift Type:</h3>
                            <p>{currentCampaign?.typeGift}</p>
                            <h3>Location:</h3>
                            <p>{currentCampaign?.location}</p>
                            <h3>Implementation Time:</h3>
                            <p>{date} & {time}</p>
                            <h3>Implementation Method:</h3>
                            <p>{currentCampaign?.implementationMethod}</p>
                            {currentCampaign?.campaignType === "Limited" && (
                                <>
                                    <h3>Number of Gifts:</h3>
                                    <p>{currentCampaign?.limitedQuantity}</p>
                                </>
                            )}
                            {currentCampaign?.campaignType === "Voluntary" && (
                                <>
                                    <h3>Start Register Date:</h3>
                                    <p>{currentCampaign?.startRegisterDate}</p>
                                    <h3>End Register Date:</h3>
                                    <p>{currentCampaign?.endRegisterDate}</p>
                                </>
                            )}
                        </div>
                        <div className="sdcucr2r3c2">
                            <h2>Financial information</h2>
                            <h3>Estimated Budget:</h3>
                            <p>{currentCampaign?.estimatedBudget}</p>
                            <h3>Average cost per gift:</h3>
                            <p>{currentCampaign?.averageCostPerGift}</p>
                            <h2>Media</h2>
                            <h3>Sponsor:</h3>
                            <p>{currentCampaign?.sponsors}</p>
                            <h3>Communication:</h3>
                            <p>{currentCampaign?.communication}</p>
                        </div>
                    </div>
                    <div className="sdcucr2r4">
                        {currentCampaign?.images.map((img, index) => (
                            <img key={index} src={img} alt={"Campaign Image ${index + 1}"} style={{ width: "150px", height: "150px", margin: "5px" }} />
                        ))}
                    </div>
                    {currentCampaign?.status === "Pending" && (
                        <>
                            {currentCampaign.reviewComments && currentCampaign.reviewComments?.length > 0 && (
                                <div className="sdcucr2r5">
                                    <h3>Review Comments</h3>
                                    {currentCampaign.reviewComments?.map((comment, index) => (
                                        <p key={index} style={{ whiteSpace: "pre-line" }}>{comment.content}</p>
                                    ))}
                                </div>
                            )}
                            <button className='approve-btn' onClick={() => handleApproveCampaign({ campaignId: String(id) })}>Approve</button>
                            <button className='reject-btn' onClick={() => handleRejectCampaign(String(id))}>Reject</button>
                            <button className='additional-btn' onClick={() => handleAdditionalCampaign(String(id))}>Additional</button>
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
            <RejectCampaignModal isOpen={isRejectCampaignModalOpen} setIsOpen={setIsRejectCampaignModalOpen} selectedCampaign={selectedRejectCampaign} />
            <AdditionalCampaignModal isOpen={isAdditionalCampaignModalOpen} setIsOpen={setIsAdditionalCampaignModalOpen} selectedCampaign={selectedAdditionalCampaign} />
        </section>
    )
}

export default StaffDetailCampaignUserPage