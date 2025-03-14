import { selectGetAllRecipientCertificate } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons';
import { RejectCertificateModal } from '@/components/Modal';
import { approveCertificateApiThunk, confirmUserApiThunk, getAllRecipientCertificateApiThunk } from '@/services/user/userThunk';
import { ApproveCertificate, ConfirmUser, RejectCertificate } from '@/types/user';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const StaffListRecipientCertificate = () => {
    const dispatch = useAppDispatch();

    const recipientCertificates = useAppSelector(selectGetAllRecipientCertificate);

    const [selectedCertificate, setSelectedCertificate] = useState<RejectCertificate | null>(null);

    const [isRejectCertificateModalOpen, setIsRejectCertificateModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllRecipientCertificateApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
            });
    }, []);

    const handleApproveCertificate = async (values: ApproveCertificate, confirmValues: ConfirmUser) => {
        try {
            await dispatch(confirmUserApiThunk(confirmValues)).unwrap();

            await dispatch(approveCertificateApiThunk(values)).unwrap();

            toast.success("Approve Certificate Successfully");

            dispatch(getAllRecipientCertificateApiThunk());
        } catch (error) {
            console.error("Error in approval process:", error);
            toast.error("An error occurred while approving the certificate.");
        }
    };


    const handleRejectCertificate = (certificateId: string , type: number) => {
        setSelectedCertificate({ certificateId, type, comment: "" });
        setIsRejectCertificateModalOpen(true);
    };

    // const handleToDetail = (campaignId: string) => {
    //     const url = routes.staff.user.detail.replace(":id", campaignId);
    //     return navigateHook(url)
    // }

    return (
        <section id="staff-list-recipient-certificate" className="staff-section">
            <div className="staff-container slrc-container">
                <div className="slrccr1">
                    <h1>User</h1>
                    <p>Dashboard<span className="staff-tag">User</span></p>
                </div>
                <div className="slrccr2">
                    <div className="staff-tab staff-tab-1">
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Total</h3>
                            <p>7 Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2">
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Approve</h3>
                            <p>7 Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3">
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Reject</h3>
                            <p>7 Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4">
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Pending</h3>
                            <p>7 Certificates</p>
                        </div>
                    </div>
                </div>
                <div className="slrccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    CCCD
                                </th>
                                <th className="table-head-cell">
                                    Full Name
                                </th>
                                <th className="table-head-cell">
                                    Phone
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
                            {recipientCertificates.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className='table-body-cell'>{row.citizenId}</td>
                                    <td className='table-body-cell'>{row.fullName}</td>
                                    <td className='table-body-cell'>{row.phone}</td>
                                    <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                    <td className="table-body-cell">
                                        {/* <button className="view-btn" onClick={() => handleToDetail(row.id)}>View</button> */}
                                        {row.status === "Pending" ? (
                                            <>
                                                <button className="view-btn">View</button>
                                                <button className="approve-btn" onClick={() => handleApproveCertificate({ certificateId: row.recipientCertificateId, type: 3 }, { accountId: row.recipientId, type: "3" })}>Approve</button>
                                                <button className="reject-btn" onClick={() => handleRejectCertificate(row.recipientCertificateId, 3)}>Reject</button>
                                            </>
                                        ) : (
                                            <button className="view-btn">View</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <RejectCertificateModal selectedCertificate={selectedCertificate} isOpen={isRejectCertificateModalOpen} setIsOpen={setIsRejectCertificateModalOpen} />
        </section>
    )
}

export default StaffListRecipientCertificate