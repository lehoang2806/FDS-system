import { selectGetAllDonorCertificate } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons';
import { RejectCertificateModal } from '@/components/Modal';
import { setLoading } from '@/services/app/appSlice';
import { approveCertificateApiThunk, confirmUserApiThunk, getAllDonorCertificateApiThunk } from '@/services/user/userThunk';
import { ApproveCertificate, ConfirmUser, RejectCertificate } from '@/types/user';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const StaffListDonorCertificate = () => {
    const dispatch = useAppDispatch();

    const donorCertificates = useAppSelector(selectGetAllDonorCertificate);

    const [selectedCertificate, setSelectedCertificate] = useState<RejectCertificate | null>(null);

    const [isRejectCertificateModalOpen, setIsRejectCertificateModalOpen] = useState(false);

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllDonorCertificateApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch]);

    const handleApproveCertificate = async (values: ApproveCertificate, confirmValues: ConfirmUser) => {
        try {
            await Promise.all([
                dispatch(confirmUserApiThunk(confirmValues)).unwrap(),
                dispatch(approveCertificateApiThunk(values)).unwrap()
            ]);
    
            toast.success("Approve Certificate Successfully");
    
            dispatch(getAllDonorCertificateApiThunk());
        } catch (error) {
            console.error("Error in approval process:", error);
            toast.error("An error occurred while approving the certificate.");
        }
    };    


    const handleRejectCertificate = (certificateId: string, type: number) => {
        setSelectedCertificate({ certificateId, type, comment: "" });
        setIsRejectCertificateModalOpen(true);
    };

    // const handleToDetail = (campaignId: string) => {
    //     const url = routes.staff.user.detail.replace(":id", campaignId);
    //     return navigateHook(url)
    // }

    return (
        <section id="staff-list-donor-certificate" className="staff-section">
            <div className="staff-container sldc-container">
                <div className="sldccr1">
                    <h1>User</h1>
                    <p>Dashboard<span className="staff-tag">User</span></p>
                </div>
                <div className="sldccr2">
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
                <div className="sldccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Full Name
                                </th>
                                <th className="table-head-cell">
                                    Phone
                                </th>
                                <th className="table-head-cell">
                                    Type
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
                            {donorCertificates.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className='table-body-cell'>{row.fullName}</td>
                                    <td className='table-body-cell'>{row.phone}</td>
                                    <td className='table-body-cell'>{row.citizenId === null ? "Organization" : "Personal"}</td>
                                    <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                    <td className="table-body-cell">
                                        {/* <button className="view-btn" onClick={() => handleToDetail(row.id)}>View</button> */}
                                        {row.status === "Pending" ? (
                                            <>
                                                <button className="view-btn">View</button>
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => {
                                                        row.citizenId === null
                                                            ? handleApproveCertificate({ certificateId: row.donorCertificateId, type: 2 }, { accountId: row.donorId, type: "2" })
                                                            : handleApproveCertificate({ certificateId: row.donorCertificateId, type: 1 }, { accountId: row.donorId, type: "1" });
                                                    }}
                                                >
                                                    Approve
                                                </button>
                                                <button className="reject-btn" onClick={() => {
                                                    row.citizenId === null
                                                        ? handleRejectCertificate(row.donorCertificateId, 2)
                                                        : handleRejectCertificate(row.donorCertificateId, 1);
                                                }}>Reject</button>
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

export default StaffListDonorCertificate