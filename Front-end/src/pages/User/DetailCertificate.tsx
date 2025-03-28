import { selectGetOrganizationDonorCertificateById, selectGetPersonalDonorCertificateById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setLoading } from "@/services/app/appSlice";
import { getOrganizationDonorCertificateByIdApiThunk, getPersonalDonorCertificateByIdApiThunk } from "@/services/user/userThunk";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const UserDetailCertificate = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const certificateType = searchParams.get("type");
    const dispatch = useAppDispatch()

    const currentPersonalDonorCertificate = useAppSelector(selectGetPersonalDonorCertificateById);
    const currentOrganizationDonorCertificate = useAppSelector(selectGetOrganizationDonorCertificateById);

    console.log(currentPersonalDonorCertificate)

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

    return (
        <main id="user-detail-certificate">
            <section id="udc-section">
                <h1>Thông tin xác minh tài khoản</h1>
                {currentPersonalDonorCertificate && certificateType === "Personal" && <h2>Trạng thái: <span>{currentPersonalDonorCertificate.status}</span></h2>}
                {currentOrganizationDonorCertificate && certificateType === "Organization" && <h2>Trạng thái: <span>{currentOrganizationDonorCertificate.status}</span></h2>}
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
                                    <p>{currentPersonalDonorCertificate?.socialMediaLink}</p>
                                </div>
                                {currentPersonalDonorCertificate && currentPersonalDonorCertificate.reviewComments && currentPersonalDonorCertificate.status === "Pending" && (
                                    <div className="udcsc1r2">
                                        {currentPersonalDonorCertificate.reviewComments?.map((comment, index) => (
                                            <div key={index}>
                                                <p>{comment.content}</p>
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
                                    <p>{currentPersonalDonorCertificate?.mainSourceIncome}</p>
                                    <h2>Thu nhập hàng tháng</h2>
                                    <p>{currentPersonalDonorCertificate?.monthlyIncome}</p>
                                </div>
                                <div className="udcsc2r2">
                                    <h1>Hình ảnh xác minh</h1>
                                    {currentPersonalDonorCertificate?.images.map((image, index) => (
                                        <div key={index}>
                                            <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                        </div>
                                    ))}
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
                                    <p>{currentOrganizationDonorCertificate?.organizationAbbreviatedName}</p>
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
                                    <p>{currentOrganizationDonorCertificate?.websiteLink}</p>
                                </div>
                                {currentOrganizationDonorCertificate && currentOrganizationDonorCertificate.reviewComments && currentOrganizationDonorCertificate.status === "Pending" && (
                                    <div className="udcsc1r2">
                                        {currentOrganizationDonorCertificate.reviewComments?.map((comment, index) => (
                                            <div key={index}>
                                                <p>{comment.content}</p>
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
                                    {currentOrganizationDonorCertificate?.images.map((image, index) => (
                                        <div key={index}>
                                            <img src={image} alt={`Image ${index}`} style={{ width: '200px', height: '200px' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    )
}

export default UserDetailCertificate