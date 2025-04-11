import { selectGetOrganizationDonorCertificateById, selectGetPersonalDonorCertificateById, selectGetRecipientCertificateById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { UpdateOrganizationDonorCertificateModal, UpdatePersonalDonorCertificateModal, UpdateRecipientCertificateModal } from "@/components/Modal";
import { setLoading } from "@/services/app/appSlice";
import { getOrganizationDonorCertificateByIdApiThunk, getPersonalDonorCertificateByIdApiThunk, getRecipientCertificateByIdApiThunk } from "@/services/user/userThunk";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const UserDetailCertificate = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const certificateType = searchParams.get("type");
    const dispatch = useAppDispatch()

    const currentPersonalDonorCertificate = useAppSelector(selectGetPersonalDonorCertificateById);
    const currentOrganizationDonorCertificate = useAppSelector(selectGetOrganizationDonorCertificateById);
    const currentRecipientCertificate = useAppSelector(selectGetRecipientCertificateById);

    const [isUpdatePersonalDonorCertificateModalOpen, setIsUpdatePersonalDonorCertificateModalOpen] = useState(false);
    const [isUpdateOrganizationDonorCertificateModalOpen, setIsUpdateOrganizationDonorCertificateModalOpen] = useState(false);
    const [isUpdateRecipientCertificateModalOpen, setIsUpdateRecipientCertificateModalOpen] = useState(false);

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
        else if (certificateType === "Recipient") {
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
        }
    }, [id, dispatch])

    return (
        <main id="user-detail-certificate">
            <section id="udc-section">
                <h1>Thông tin xác minh tài khoản</h1>
                {currentPersonalDonorCertificate && certificateType === "Personal" && <h2>Trạng thái: <span>{currentPersonalDonorCertificate?.status === "Pending" ? <span className='status-pending'>Đang chờ phê duyệt</span> : currentPersonalDonorCertificate?.status === "Approved" ? <span className='status-approve'>Đã được phê duyệt</span> : <span className='status-reject'>Đã bị từ chối</span>}</span></h2>}
                {currentOrganizationDonorCertificate && certificateType === "Organization" && <h2>Trạng thái: <span>{currentOrganizationDonorCertificate?.status === "Pending" ? <span className='status-pending'>Đang chờ phê duyệt</span> : currentOrganizationDonorCertificate?.status === "Approved" ? <span className='status-approve'>Đã được phê duyệt</span> : <span className='status-reject'>Đã bị từ chối</span>}</span></h2>}
                {currentRecipientCertificate && certificateType === "Recipient" && <h2>Trạng thái: <span>{currentRecipientCertificate?.status === "Pending" ? <span className='status-pending'>Đang chờ phê duyệt</span> : currentRecipientCertificate?.status === "Approved" ? <span className='status-approve'>Đã được phê duyệt</span> : <span className='status-reject'>Đã bị từ chối</span>}</span></h2>}
                {currentPersonalDonorCertificate && certificateType === "Personal" && <button className="pr-btn" onClick={() => setIsUpdatePersonalDonorCertificateModalOpen(true)}>Cập nhật</button>}
                {currentOrganizationDonorCertificate && certificateType === "Organization" && <button className="pr-btn" onClick={() => setIsUpdateOrganizationDonorCertificateModalOpen(true)}>Cập nhật</button>}
                {currentRecipientCertificate && certificateType === "Recipient" && <button className="pr-btn" onClick={() => setIsUpdateRecipientCertificateModalOpen(true)}>Cập nhật</button>}
                <div className="udcs-container">
                    {certificateType === "Personal" && (
                        <>
                            <div className="col-flex udcsc1">
                                <div className="udcsc1r1">
                                    <h1>Thông tin cá nhân</h1>
                                    <h2>Họ Và tên</h2>
                                    <p>{currentPersonalDonorCertificate?.fullName}</p>
                                    <h2>Ngày sinh</h2>
                                    <p>{currentPersonalDonorCertificate?.birthDay}</p>
                                    <h2>Số điện thoại</h2>
                                    <p>{currentPersonalDonorCertificate?.phone}</p>
                                    <h2>Email</h2>
                                    <p>{currentPersonalDonorCertificate?.email}</p>
                                    <h2>Địa chỉ</h2>
                                    <p>{currentPersonalDonorCertificate?.address}</p>
                                    <h2>Số CCCD</h2>
                                    <p>{currentPersonalDonorCertificate?.citizenId}</p>
                                    <h2>Liên kết mạng xã hội</h2>
                                    <p>{currentPersonalDonorCertificate?.socialMediaLink ? currentPersonalDonorCertificate.socialMediaLink : "Không có"}</p>
                                </div>
                                {currentPersonalDonorCertificate && currentPersonalDonorCertificate.reviewComments && currentPersonalDonorCertificate.status === "Pending" && (
                                    <div className="udcsc1r2">
                                        <h2>Các yêu cầu cần bổ sung</h2>
                                        {currentPersonalDonorCertificate.reviewComments?.map((comment, index) => (
                                            <div key={index}>
                                                <p style={{ whiteSpace: 'pre-line' }}>{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {currentPersonalDonorCertificate && currentPersonalDonorCertificate.status === "Rejected" && (
                                    <div className="udcsc1r2">
                                        <h2>Lí do bị từ chối:</h2>
                                        <p>{currentPersonalDonorCertificate.rejectComment}</p>
                                    </div>
                                )}
                            </div>
                            <div className="col-flex udcsc2">
                                <div className="udcsc2r1">
                                    <h1>Thông tin tài chính</h1>
                                    <h2>Thu nhập chính</h2>
                                    <p>{currentPersonalDonorCertificate?.mainSourceIncome ? currentPersonalDonorCertificate?.mainSourceIncome : "Không có"}</p>
                                    <h2>Thu nhập hàng tháng</h2>
                                    <p>{currentPersonalDonorCertificate?.monthlyIncome ? currentPersonalDonorCertificate?.monthlyIncome : "Không có"}</p>
                                </div>
                                <div className="udcsc2r2">
                                    <h1>Hình ảnh xác minh</h1>
                                    <div className="image-preview-container">
                                        {currentPersonalDonorCertificate?.images.map((image, index) => (
                                            <div key={index}>
                                                <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {certificateType === "Organization" && (
                        <>
                            <div className="col-flex udcsc1">
                                <div className="udcsc1r1">
                                    <h1>Thông tin tổ chức</h1>
                                    <h2>Tên tổ chức</h2>
                                    <p>{currentOrganizationDonorCertificate?.organizationName}</p>
                                    <h2>Mã số thuế</h2>
                                    <p>{currentOrganizationDonorCertificate?.taxIdentificationNumber}</p>
                                    <h2>Tên viết tắt</h2>
                                    <p>{currentOrganizationDonorCertificate?.organizationAbbreviatedName ? currentOrganizationDonorCertificate.organizationAbbreviatedName : "Không có"}</p>
                                    <h2>Loại hình tổ chức</h2>
                                    <p>{currentOrganizationDonorCertificate?.organizationType}</p>
                                    <h2>Ngành nghề chính</h2>
                                    <p>{currentOrganizationDonorCertificate?.mainBusiness}</p>
                                    <h2>Địa chỉ tổ chức</h2>
                                    <p>{currentOrganizationDonorCertificate?.organizationAddress}</p>
                                    <h2>Số điện thoại tổ chức</h2>
                                    <p>{currentOrganizationDonorCertificate?.contactPhone}</p>
                                    <h2>Email tổ chức</h2>
                                    <p>{currentOrganizationDonorCertificate?.organizationEmail}</p>
                                    <h2>Website tổ chức</h2>
                                    <p>{currentOrganizationDonorCertificate?.websiteLink ? currentOrganizationDonorCertificate.websiteLink : "Không có link website"}</p>
                                </div>
                                {currentOrganizationDonorCertificate && currentOrganizationDonorCertificate.reviewComments && currentOrganizationDonorCertificate.status === "Pending" && (
                                    <div className="udcsc1r2">
                                        <h2>Các yêu cầu cần bổ sung</h2>
                                        {currentOrganizationDonorCertificate.reviewComments?.map((comment, index) => (
                                            <div key={index}>
                                                <p style={{ whiteSpace: 'pre-line' }}>{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {currentOrganizationDonorCertificate && currentOrganizationDonorCertificate.status === "Rejected" && (
                                    <div className="udcsc1r2">
                                        <h2>Lí do bị từ chối:</h2>
                                        <p>{currentOrganizationDonorCertificate.rejectComment}</p>
                                    </div>
                                )}
                            </div>
                            <div className="col-flex udcsc2">
                                <div className="udcsc2r1">
                                    <h1>Thông tin người đại diện</h1>
                                    <h2>Tên người đại diện</h2>
                                    <p>{currentOrganizationDonorCertificate?.representativeName}</p>
                                    <h2>Số điện thoại người đại diện</h2>
                                    <p>{currentOrganizationDonorCertificate?.representativePhone}</p>
                                    <h2>Email người đại diện</h2>
                                    <p>{currentOrganizationDonorCertificate?.representativeEmail}</p>
                                </div>
                                <div className="udcsc2r2">
                                    <h1>Hình ảnh xác minh</h1>
                                    <div className="image-preview-container">
                                        {currentOrganizationDonorCertificate?.images.map((image, index) => (
                                            <div key={index}>
                                                <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {certificateType === "Recipient" && (
                        <>
                            <div className="col-flex udcsc1">
                                <div className="udcsc1r1">
                                    <h1>Thông tin cá nhân</h1>
                                    <h2>Họ Và tên</h2>
                                    <p>{currentRecipientCertificate?.fullName}</p>
                                    <h2>Ngày sinh</h2>
                                    <p>{currentRecipientCertificate?.birthDay}</p>
                                    <h2>Số điện thoại</h2>
                                    <p>{currentRecipientCertificate?.phone}</p>
                                    <h2>Email</h2>
                                    <p>{currentRecipientCertificate?.email}</p>
                                    <h2>Địa chỉ</h2>
                                    <p>{currentRecipientCertificate?.address}</p>
                                    <h2>Số CCCD</h2>
                                    <p>{currentRecipientCertificate?.citizenId}</p>
                                    <h2>Hoàn cảnh gia đình</h2>
                                    <p>{currentRecipientCertificate?.circumstances}</p>
                                </div>
                                {currentRecipientCertificate && currentRecipientCertificate.reviewComments && currentRecipientCertificate.status === "Pending" && (
                                    <div className="udcsc1r2">
                                        <h2>Các yêu cầu cần bổ sung</h2>
                                        {currentRecipientCertificate.reviewComments?.map((comment, index) => (
                                            <div key={index}>
                                                <p style={{ whiteSpace: 'pre-line' }}>{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {currentRecipientCertificate && currentRecipientCertificate.status === "Rejected" && (
                                    <div className="udcsc1r2">
                                        <h2>Lí do bị từ chối:</h2>
                                        <p>{currentRecipientCertificate.rejectComment}</p>
                                    </div>
                                )}
                            </div>
                            <div className="col-flex udcsc2">
                                <div className="udcsc2r1">
                                    <h1>Thông tin tài chính</h1>
                                    <h2>Thu nhập chính</h2>
                                    <p>{currentRecipientCertificate?.mainSourceIncome ? currentRecipientCertificate?.mainSourceIncome : "Không có"}</p>
                                    <h2>Thu nhập hàng tháng</h2>
                                    <p>{currentRecipientCertificate?.monthlyIncome ? currentRecipientCertificate?.monthlyIncome : "Không có"}</p>
                                    <h2>Lí do đăng ký hỗ trợ</h2>
                                    <p>{currentRecipientCertificate?.registerSupportReason}</p>
                                </div>
                                <div className="udcsc2r2">
                                    <h1>Hình ảnh xác minh</h1>
                                    <div className="image-preview-container">
                                        {currentRecipientCertificate?.images.map((image, index) => (
                                            <div key={index}>
                                                <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <UpdatePersonalDonorCertificateModal isOpen={isUpdatePersonalDonorCertificateModalOpen} setIsOpen={setIsUpdatePersonalDonorCertificateModalOpen} selectedCurrentPersonalDonorCertificate={currentPersonalDonorCertificate} />
            <UpdateOrganizationDonorCertificateModal isOpen={isUpdateOrganizationDonorCertificateModalOpen} setIsOpen={setIsUpdateOrganizationDonorCertificateModalOpen} selectedCurrentOrganizationDonorCertificate={currentOrganizationDonorCertificate} />
            <UpdateRecipientCertificateModal isOpen={isUpdateRecipientCertificateModalOpen} setIsOpen={setIsUpdateRecipientCertificateModalOpen} selectedCurrentRecipientCertificate={currentRecipientCertificate} />
        </main>
    )
}

export default UserDetailCertificate