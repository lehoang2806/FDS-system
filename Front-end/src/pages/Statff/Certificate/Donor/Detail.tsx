import { selectGetOrganizationDonorCertificateById, selectGetPersonalDonorCertificateById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { AdditionalCertificateModal, RejectCertificateModal } from "@/components/Modal";
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { setLoading } from "@/services/app/appSlice";
import { approveCertificateApiThunk, confirmUserApiThunk, getOrganizationDonorCertificateByIdApiThunk, getPersonalDonorCertificateByIdApiThunk } from "@/services/user/userThunk";
import { ApproveCertificate, ConfirmUser, RejectCertificate, ReviewCertificate } from "@/types/user";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const StaffDetailDonorCertificate = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const certificateType = searchParams.get("type");
    const dispatch = useAppDispatch()

    const currentPersonalDonorCertificate = useAppSelector(selectGetPersonalDonorCertificateById);
    const currentOrganizationDonorCertificate = useAppSelector(selectGetOrganizationDonorCertificateById);

    const currentPersonalDonorCertificateCreateDate = currentPersonalDonorCertificate?.createdDate.split("T")[0];
    const currentOrganizationDonorCertificateCreateDate = currentOrganizationDonorCertificate?.createdDate.split("T")[0];

    const [isRejectCertificateModalOpen, setIsRejectCertificateModalOpen] = useState(false);
    const [selectedRejectCertificate, setSelectedRejectCertificate] = useState<RejectCertificate | null>(null);

    const [isAdditionalCertificateModalOpen, setIsAdditionalCertificateModalOpen] = useState(false);
    const [selectedAdditionalCertificate, setSelectedAdditionalCertificate] = useState<ReviewCertificate | null>(null);

    useEffect(() => {
        if (certificateType === "Personal") {
            dispatch(setLoading(true));
            dispatch(getPersonalDonorCertificateByIdApiThunk(String(id)))
                .unwrap()
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                });
        }
        else if (certificateType === "Organization") {
            dispatch(setLoading(true));
            dispatch(getOrganizationDonorCertificateByIdApiThunk(String(id)))
                .unwrap()
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                });
        }
    }, [id, dispatch])


    const handleApproveCertificate = async (values: ApproveCertificate, confirmValues: ConfirmUser) => {
        try {
            await Promise.all([
                dispatch(confirmUserApiThunk(confirmValues)).unwrap(),
                dispatch(approveCertificateApiThunk(values)).unwrap()
            ]);

            toast.success("Approve Certificate Successfully");

            if (certificateType === "Personal") {
                dispatch(getPersonalDonorCertificateByIdApiThunk(String(id)));
            }
            else if (certificateType === "Organization") {
                dispatch(getOrganizationDonorCertificateByIdApiThunk(String(id)));
            }
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
        <section id="staff-detail-certificate-donor" className="staff-section">
            <div className="staff-container sdcd-container">
                <div className="sdcdcr1">
                    <h1>Donor's Certificate</h1>
                    <p>Dashboard<span className="staff-tag">Detail Donor's Certificate</span></p>
                </div>
                <div className="sdcdcr2">
                    <div className="sdcdcr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.certificate.donor.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcdcr2r2">
                        <div className="sdcdcr2r2c1">
                            <h3>Certificate Status:</h3>
                            {currentPersonalDonorCertificate && certificateType === "Personal" && <p>{currentPersonalDonorCertificate.status}</p>}
                            {currentOrganizationDonorCertificate && certificateType === "Organization" && <p>{currentOrganizationDonorCertificate.status}</p>}
                        </div>
                        <div className="sdcdcr2r2c2">
                            <h3>Created Date:</h3>
                            {currentPersonalDonorCertificate && certificateType === "Personal" && <p>{currentPersonalDonorCertificateCreateDate}</p>}
                            {currentOrganizationDonorCertificate && certificateType === "Organization" && <p>{currentOrganizationDonorCertificateCreateDate}</p>}
                        </div>
                    </div>
                    <hr />
                    <div className="sdcdcr2r3">
                        {certificateType === "Personal" && (
                            <>
                                <div className="sdcdcr2r3c1">
                                    <h2>Thông tin cá nhân</h2>
                                    <h3>Họ Và tên</h3>
                                    <p>{currentPersonalDonorCertificate?.fullName}</p>
                                    <h3>Ngày sinh</h3>
                                    <p>{currentPersonalDonorCertificate?.birthDay}</p>
                                    <h3>Số điện thoại</h3>
                                    <p>{currentPersonalDonorCertificate?.phone}</p>
                                    <h3>Email</h3>
                                    <p>{currentPersonalDonorCertificate?.email}</p>
                                    <h3>Địa chỉ</h3>
                                    <p>{currentPersonalDonorCertificate?.address}</p>
                                    <h3>Số CCCD</h3>
                                    <p>{currentPersonalDonorCertificate?.citizenId}</p>
                                    <h3>Liên kết mạng xã hội</h3>
                                    <p>{currentPersonalDonorCertificate?.socialMediaLink}</p>
                                </div>
                                <div className="sdcdcr2r3c2">
                                    <h2>Thông tin tài chính</h2>
                                    <h3>Thu nhập chính</h3>
                                    <p>{currentPersonalDonorCertificate?.mainSourceIncome}</p>
                                    <h3>Thu nhập hàng tháng</h3>
                                    <p>{currentPersonalDonorCertificate?.monthlyIncome}</p>
                                </div>
                            </>
                        )}
                        {certificateType === "Organization" && (
                            <>
                                <div className="sdcdcr2r3c1">
                                    <h2>Thông tin tổ chức</h2>
                                    <h3>Tên tổ chức</h3>
                                    <p>{currentOrganizationDonorCertificate?.organizationName}</p>
                                    <h3>Mã số thuế</h3>
                                    <p>{currentOrganizationDonorCertificate?.taxIdentificationNumber}</p>
                                    <h3>Tên viết tắt</h3>
                                    <p>{currentOrganizationDonorCertificate?.organizationAbbreviatedName}</p>
                                    <h3>Loại hình tổ chức</h3>
                                    <p>{currentOrganizationDonorCertificate?.organizationType}</p>
                                    <h3>Ngành nghề chính</h3>
                                    <p>{currentOrganizationDonorCertificate?.mainBusiness}</p>
                                    <h3>Địa chỉ tổ chức</h3>
                                    <p>{currentOrganizationDonorCertificate?.organizationAddress}</p>
                                    <h3>Số điện thoại tổ chức</h3>
                                    <p>{currentOrganizationDonorCertificate?.contactPhone}</p>
                                    <h3>Email tổ chức</h3>
                                    <p>{currentOrganizationDonorCertificate?.organizationEmail}</p>
                                    <h3>Website tổ chức</h3>
                                    <p>{currentOrganizationDonorCertificate?.websiteLink}</p>
                                </div>
                                <div className="sdcdcr2r3c2">
                                    <h2>Thông tin người đại diện</h2>
                                    <h3>Tên người đại diện</h3>
                                    <p>{currentOrganizationDonorCertificate?.representativeName}</p>
                                    <h3>Số điện thoại người đại diện</h3>
                                    <p>{currentOrganizationDonorCertificate?.representativePhone}</p>
                                    <h3>Email người đại diện</h3>
                                    <p>{currentOrganizationDonorCertificate?.representativeEmail}</p>
                                </div>
                            </>
                        )}
                    </div>
                    {/* Personal */}
                    {currentPersonalDonorCertificate && certificateType === "Personal" && currentPersonalDonorCertificate.images && (
                        <>
                            <hr />
                            <div className="sdcdcr2r4">
                                <h2>Hình ảnh xác minh</h2>
                                {currentPersonalDonorCertificate?.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {currentPersonalDonorCertificate && currentPersonalDonorCertificate.reviewComments && currentPersonalDonorCertificate.status === "Pending" && (
                        <>
                            <hr />
                            <div className="udcsc1r5">
                                <h2>Các yêu cầu cần bổ sung</h2>
                                {currentPersonalDonorCertificate.reviewComments?.map((comment, index) => (
                                    <div key={index}>
                                        <p style={{ whiteSpace: "pre-line" }}>{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {currentPersonalDonorCertificate && currentPersonalDonorCertificate.status === "Rejected" && (
                        <>
                            <hr />
                            <div className="udcsc1r5">
                                <h2>Lí do bị từ chối:</h2>
                                <p>{currentPersonalDonorCertificate.rejectComment}</p>
                            </div>
                        </>
                    )}
                    {certificateType === "Personal" && (
                        <>
                            {currentPersonalDonorCertificate && currentPersonalDonorCertificate.status === "Pending" && (
                                <>
                                    <hr />
                                    <div className="sdcdcr2r6">
                                        <div className="group-btn">
                                            <button
                                                className="approve-btn"
                                                onClick={() => {
                                                    handleApproveCertificate({ certificateId: currentPersonalDonorCertificate?.personalDonorCertificateId, type: 1 }, { accountId: currentPersonalDonorCertificate?.donorId, type: "1" });
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button className="reject-btn" onClick={() => {
                                                handleRejectCertificate(currentPersonalDonorCertificate.personalDonorCertificateId, 1);
                                            }}>
                                                Reject
                                            </button>
                                            <button className='additional-btn' onClick={() => handleAdditionalCertificate(currentPersonalDonorCertificate.personalDonorCertificateId, 1)}>Additional</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {/* Organization */}
                    {currentOrganizationDonorCertificate && certificateType === "Organization" && currentOrganizationDonorCertificate.images && (
                        <>
                            <hr />
                            <div className="sdcdcr2r4">
                                <h2>Hình ảnh xác minh</h2>
                                {currentOrganizationDonorCertificate?.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {currentOrganizationDonorCertificate && currentOrganizationDonorCertificate.reviewComments && currentOrganizationDonorCertificate.status === "Pending" && (
                        <>
                            <hr />
                            <div className="udcsc1r5">
                                {currentPersonalDonorCertificate.reviewComments?.map((comment, index) => (
                                    <div key={index}>
                                        <p style={{ whiteSpace: "pre-line" }}>{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {currentOrganizationDonorCertificate && currentOrganizationDonorCertificate.status === "Rejected" && (
                        <>
                            <hr />
                            <div className="udcsc1r5">
                                <h2>Lí do bị từ chối:</h2>
                                <p>{currentOrganizationDonorCertificate.rejectComment}</p>
                            </div>
                        </>
                    )}
                    {certificateType === "Organization" && (
                        <>
                            {currentOrganizationDonorCertificate && currentOrganizationDonorCertificate.status === "Pending" && (
                                <>
                                    <hr />
                                    <div className="sdcdcr2r6">
                                        <div className="group-btn">
                                            <button
                                                className="approve-btn"
                                                onClick={() => {
                                                    handleApproveCertificate({ certificateId: currentOrganizationDonorCertificate?.organizationDonorCertificateId, type: 2 }, { accountId: currentOrganizationDonorCertificate?.donorId, type: "2" });
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button className="reject-btn" onClick={() => {
                                                handleRejectCertificate(currentOrganizationDonorCertificate.organizationDonorCertificateId, 2);
                                            }}>
                                                Reject
                                            </button>
                                            <button className='additional-btn' onClick={() => handleAdditionalCertificate(currentOrganizationDonorCertificate.organizationDonorCertificateId, 2)}>Additional</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <RejectCertificateModal selectedCertificate={selectedRejectCertificate} isOpen={isRejectCertificateModalOpen} setIsOpen={setIsRejectCertificateModalOpen} />
            <AdditionalCertificateModal selectedCertificate={selectedAdditionalCertificate} isOpen={isAdditionalCertificateModalOpen} setIsOpen={setIsAdditionalCertificateModalOpen} />
        </section>
    )
}

export default StaffDetailDonorCertificate