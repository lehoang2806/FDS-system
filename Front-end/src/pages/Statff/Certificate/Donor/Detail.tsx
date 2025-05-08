import { selectGetOrganizationDonorCertificateById, selectGetPersonalDonorCertificateById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { AdditionalCertificateModal, RejectCertificateModal } from "@/components/Modal";
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { setLoading } from "@/services/app/appSlice";
import { approveCertificateApiThunk, confirmUserApiThunk, getOrganizationDonorCertificateByIdApiThunk, getPersonalDonorCertificateByIdApiThunk } from "@/services/user/userThunk";
import { ApproveCertificate, ConfirmUser, RejectCertificate, ReviewCertificate } from "@/types/user";
import { formatDater } from "@/utils/helper";
import { useEffect, useState } from "react";
import Lightbox from "react-awesome-lightbox";
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

    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [othersImagePreview, setOthersImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [othersLightboxIndex, setOthersLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        if (certificateType === "Personal" && currentPersonalDonorCertificate) {
            setImagePreview(currentPersonalDonorCertificate.citizenImages || []);
            setOthersImagePreview(currentPersonalDonorCertificate.otherImages || []);
        } else if (certificateType === "Organization" && currentOrganizationDonorCertificate) {
            setImagePreview(currentOrganizationDonorCertificate.images || []);
        }
    }, [certificateType, currentPersonalDonorCertificate, currentOrganizationDonorCertificate]);

    const handleApproveCertificate = async (values: ApproveCertificate, confirmValues: ConfirmUser) => {
        try {
            dispatch(setLoading(true));
            await Promise.all([
                dispatch(confirmUserApiThunk(confirmValues)).unwrap(),
                dispatch(approveCertificateApiThunk(values)).unwrap()
            ]);

            toast.success("Phê duyệt thành công");
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000);

            if (certificateType === "Personal") {
                dispatch(getPersonalDonorCertificateByIdApiThunk(String(id)));
            }
            else if (certificateType === "Organization") {
                dispatch(getOrganizationDonorCertificateByIdApiThunk(String(id)));
            }
        } catch (error) {
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
                    <h1>Đơn xác minh</h1>
                    <p>Dashboard<span className="staff-tag">Người tặng thực phẩm</span></p>
                </div>
                <div className="sdcdcr2">
                    <div className="sdcdcr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.certificate.donor.list)}>Quay lại trang danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcdcr2r2">
                        <div className="sdcdcr2r2c1">
                            <h3>Trang thái:</h3>
                            {currentPersonalDonorCertificate && certificateType === "Personal" && <p>{currentPersonalDonorCertificate?.status === "Pending" ? <span>Đang chờ phê duyệt</span> : currentPersonalDonorCertificate?.status === "Approved" ? <span>Đã được phê duyệt</span> : <span>Đã bị từ chối</span>}</p>}
                            {currentOrganizationDonorCertificate && certificateType === "Organization" && <p>{currentOrganizationDonorCertificate?.status === "Pending" ? <span>Đang chờ phê duyệt</span> : currentOrganizationDonorCertificate?.status === "Approved" ? <span>Đã được phê duyệt</span> : <span>Đã bị từ chối</span>}</p>}
                        </div>
                        <div className="sdcdcr2r2c2">
                            <h3>Ngày gửi:</h3>
                            {currentPersonalDonorCertificate && certificateType === "Personal" && <p>{formatDater(String(currentPersonalDonorCertificateCreateDate))}</p>}
                            {currentOrganizationDonorCertificate && certificateType === "Organization" && <p>{formatDater(String(currentOrganizationDonorCertificateCreateDate))}</p>}
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
                                    {currentPersonalDonorCertificate && currentPersonalDonorCertificate.socialMediaLink && (
                                        <>
                                            <h3>Liên kết mạng xã hội</h3>
                                            <p>{currentPersonalDonorCertificate?.socialMediaLink}</p>
                                        </>
                                    )}
                                </div>
                                <div className="sdcdcr2r3c2">
                                    <h2>Thông tin tài chính</h2>
                                    {currentPersonalDonorCertificate && currentPersonalDonorCertificate?.mainSourceIncome && (
                                        <>
                                            <h3>Thu nhập chính</h3>
                                            <p>{currentPersonalDonorCertificate?.mainSourceIncome}</p>
                                        </>
                                    )}
                                    {currentPersonalDonorCertificate && currentPersonalDonorCertificate?.monthlyIncome && (
                                        <>
                                            <h3>Thu nhập hàng tháng</h3>
                                            <p>{currentPersonalDonorCertificate?.monthlyIncome}</p>
                                        </>
                                    )}
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
                    {currentPersonalDonorCertificate && certificateType === "Personal" && currentPersonalDonorCertificate.citizenImages && (
                        <>
                            <hr />
                            <div className="sdcdcr2r4">
                                <h2>Hình ảnh CCCD</h2>
                                {imagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {imagePreview.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Preview ${index}`}
                                                className="image-preview"
                                                style={{ width: "200px", height: "200px", cursor: "pointer" }}
                                                onClick={() => setLightboxIndex(index)} // Thêm dòng này để mở Lightbox
                                            />
                                        ))}
                                    </div>
                                )}

                                {lightboxIndex !== null && (
                                    <Lightbox
                                        images={imagePreview.map((src) => ({ url: src }))}
                                        startIndex={lightboxIndex}
                                        onClose={() => setLightboxIndex(null)}
                                    />
                                )}
                            </div>
                        </>
                    )}
                    {currentPersonalDonorCertificate && certificateType === "Personal" && currentPersonalDonorCertificate.otherImages && (
                        <>
                            <hr />
                            <div className="sdcdcr2r4">
                                <h2>Hình ảnh liên quan</h2>
                                {othersImagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {othersImagePreview.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Preview ${index}`}
                                                className="image-preview"
                                                style={{ width: "200px", height: "200px", cursor: "pointer" }}
                                                onClick={() => setOthersLightboxIndex(index)} // Thêm dòng này để mở Lightbox
                                            />
                                        ))}
                                    </div>
                                )}

                                {othersLightboxIndex !== null && (
                                    <Lightbox
                                        images={othersImagePreview.map((src) => ({ url: src }))}
                                        startIndex={othersLightboxIndex}
                                        onClose={() => setOthersLightboxIndex(null)}
                                    />
                                )}
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
                                                Phê duyệt
                                            </button>
                                            <button className="reject-btn" onClick={() => {
                                                handleRejectCertificate(currentPersonalDonorCertificate.personalDonorCertificateId, 1);
                                            }}>
                                                Từ chối
                                            </button>
                                            <button className='additional-btn' onClick={() => handleAdditionalCertificate(currentPersonalDonorCertificate.personalDonorCertificateId, 1)}>Yêu cầu bổ sung</button>
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
                                {imagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {imagePreview.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Preview ${index}`}
                                                className="image-preview"
                                                style={{ width: "200px", height: "200px", cursor: "pointer" }}
                                                onClick={() => setLightboxIndex(index)} // Thêm dòng này để mở Lightbox
                                            />
                                        ))}
                                    </div>
                                )}

                                {lightboxIndex !== null && (
                                    <Lightbox
                                        images={imagePreview.map((src) => ({ url: src }))}
                                        startIndex={lightboxIndex}
                                        onClose={() => setLightboxIndex(null)}
                                    />
                                )}
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
                                                Phê duyệt
                                            </button>
                                            <button className="reject-btn" onClick={() => {
                                                handleRejectCertificate(currentOrganizationDonorCertificate.organizationDonorCertificateId, 2);
                                            }}>
                                                Từ chối
                                            </button>
                                            <button className='additional-btn' onClick={() => handleAdditionalCertificate(currentOrganizationDonorCertificate.organizationDonorCertificateId, 2)}>Yêu cầu bổ sung</button>
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