import { selectGetRecipientCertificateById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { AdditionalCertificateModal, RejectCertificateModal } from "@/components/Modal";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { approveCertificateApiThunk, confirmUserApiThunk, getRecipientCertificateByIdApiThunk } from "@/services/user/userThunk";
import { ApproveCertificate, ConfirmUser, RejectCertificate, ReviewCertificate } from "@/types/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const StaffDetailCertificateRecipient = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch()

    const currentRecipientCertificate = useAppSelector(selectGetRecipientCertificateById);

    const [isRejectCertificateModalOpen, setIsRejectCertificateModalOpen] = useState(false);
    const [selectedRejectCertificate, setSelectedRejectCertificate] = useState<RejectCertificate | null>(null);

    const currentRecipientCertificateCreateDate = currentRecipientCertificate?.createdDate.split("T")[0];

    const [isAdditionalCertificateModalOpen, setIsAdditionalCertificateModalOpen] = useState(false);
    const [selectedAdditionalCertificate, setSelectedAdditionalCertificate] = useState<ReviewCertificate | null>(null);

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getRecipientCertificateByIdApiThunk(String(id)))
            .unwrap()
            .catch(() => {
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [id, dispatch])


    const handleApproveCertificate = async (values: ApproveCertificate, confirmValues: ConfirmUser) => {
        try {
            await Promise.all([
                dispatch(confirmUserApiThunk(confirmValues)).unwrap(),
                dispatch(approveCertificateApiThunk(values)).unwrap()
            ]);

            toast.success("Approve Certificate Successfully");

            dispatch(getRecipientCertificateByIdApiThunk(String(id)));
        } catch (error) {
            console.error("Error in approval process:", error);
            toast.error("An error occurred while approving the certificate.");
        }
    };


    const handleRejectCertificate = (certificateId: string, type: number) => {
        setSelectedRejectCertificate({ certificateId, type, comment: "" });
        setIsRejectCertificateModalOpen(true);
    };

    const handleAdditionalCertificate = (certificateId: string, type: number) => {
        setSelectedAdditionalCertificate({ certificateId, content: "", type });
        setIsAdditionalCertificateModalOpen(true);
    };

    return (
        <section id="staff-detail-certificate-recipient" className="staff-section">
            <div className="staff-container sdcr-container">
                <div className="sdcrcr1">
                    <h1>Recipient's Certificate</h1>
                    <p>Dashboard<span className="staff-tag">Detail Recipient's Certificate</span></p>
                </div>
                <div className="sdcrcr2">
                    <div className="sdcrcr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.certificate.recipient.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcrcr2r2">
                        <div className="sdcrcr2r2c1">
                            <h3>Certificate Status:</h3>
                            <p>{currentRecipientCertificate?.status}</p>
                        </div>
                        <div className="sdcrcr2r2c2">
                            <h3>Created Date:</h3>
                            <p>{currentRecipientCertificateCreateDate}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcrcr2r3">
                        <div className="sdcrcr2r3c1">
                            <h2>Thông tin cá nhân</h2>
                            <h3>Họ Và tên</h3>
                            <p>{currentRecipientCertificate?.fullName}</p>
                            <h3>Ngày sinh</h3>
                            <p>{currentRecipientCertificate?.birthDay}</p>
                            <h3>Số điện thoại</h3>
                            <p>{currentRecipientCertificate?.phone}</p>
                            <h3>Email</h3>
                            <p>{currentRecipientCertificate?.email}</p>
                            <h3>Địa chỉ</h3>
                            <p>{currentRecipientCertificate?.address}</p>
                            <h3>Số CCCD</h3>
                            <p>{currentRecipientCertificate?.citizenId}</p>
                            <h3>Hoàn cảnh gia đình</h3>
                            <p>{currentRecipientCertificate?.circumstances}</p>
                        </div>
                        <div className="sdcrcr2r3c2">
                            <h2>Thông tin tài chính</h2>
                            <h3>Thu nhập chính</h3>
                            <p>{currentRecipientCertificate?.mainSourceIncome}</p>
                            <h3>Thu nhập hàng tháng</h3>
                            <p>{currentRecipientCertificate?.monthlyIncome}</p>
                            <h3>Lí do đăng ký hỗ trợ</h3>
                            <p>{currentRecipientCertificate?.registerSupportReason}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcrcr2r4">
                        <h2>Hình ảnh xác minh</h2>
                        {currentRecipientCertificate?.images.map((image, index) => (
                            <div key={index}>
                                <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                            </div>
                        ))}
                    </div>
                    {currentRecipientCertificate && currentRecipientCertificate.reviewComments && currentRecipientCertificate.status === "Pending" && (
                        <>
                            <hr />
                            <div className="udcsc1r5">
                                <h2>Các yêu cầu cần bổ sung</h2>
                                {currentRecipientCertificate.reviewComments?.map((comment, index) => (
                                    <div key={index}>
                                        <p style={{ whiteSpace: "pre-line" }}>{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {currentRecipientCertificate && currentRecipientCertificate.status === "Rejected" && (
                        <>
                            <hr />
                            <div className="udcsc1r5">
                                <h2>Lí do bị từ chối:</h2>
                                <p>{currentRecipientCertificate.rejectComment}</p>
                            </div>
                        </>
                    )}
                    {currentRecipientCertificate && currentRecipientCertificate.status === "Pending" && (
                        <>
                            <hr />
                            <div className="sdcrcr2r6">
                                <div className="group-btn">
                                    <button
                                        className="approve-btn"
                                        onClick={() => {
                                            handleApproveCertificate({ certificateId: currentRecipientCertificate?.recipientCertificateId, type: 3 }, { accountId: currentRecipientCertificate?.recipientId, type: "3" });
                                        }}
                                    >
                                        Approve
                                    </button>
                                    <button className="reject-btn" onClick={() => {
                                        handleRejectCertificate(currentRecipientCertificate.recipientCertificateId, 3);
                                    }}>
                                        Reject
                                    </button>
                                    <button className='additional-btn' onClick={() => handleAdditionalCertificate(currentRecipientCertificate.recipientCertificateId, 3)}>Additional</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <RejectCertificateModal selectedCertificate={selectedRejectCertificate} isOpen={isRejectCertificateModalOpen} setIsOpen={setIsRejectCertificateModalOpen} />
            <AdditionalCertificateModal selectedCertificate={selectedAdditionalCertificate} isOpen={isAdditionalCertificateModalOpen} setIsOpen={setIsAdditionalCertificateModalOpen} />
        </section>
    )
}

export default StaffDetailCertificateRecipient