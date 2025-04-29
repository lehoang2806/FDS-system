import { selectGetRequestSupportById } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import RequestDonorModal from '@/components/Modal/RequestDonor'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getRequestSupportByIdApiThunk } from '@/services/requestSupport/requestSupportThunk'
import { formatDater } from '@/utils/helper'
import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const StaffDetailRequestSupportPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
    const currentRequestSupport = useAppSelector(selectGetRequestSupportById)

    const [isRequestDonorModal, setIsRequestDonorModal] = useState(false);

    const createDate = currentRequestSupport?.createdDate && currentRequestSupport?.createdDate.split("T")[0];

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getRequestSupportByIdApiThunk(String(id)))
            .unwrap()
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 1000)
            })
    }, [dispatch, id])

    return (
        <section id="staff-detail-news" className="staff-section">
            <div className="staff-container sdn-container">
                <div className="sdncr1">
                    <h1>Đơn yêu cầu hỗ trợ</h1>
                    <p>Trang tổng quát<span className="staff-tag">Chi tiết đơn yêu cầu hỗ trợ</span></p>
                </div>
                <div className="sdncr2">
                    <div className="sdncr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.request_support.list)}>Quay lại danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdncr2r2">
                        <div className="sdncr2r2c1">
                        </div>
                        <div className="sdncr2r2c2">
                            <h3>Ngày tạo:</h3>
                            <p>{formatDater(String(createDate))}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdncr2r3">
                        <div className="sdncr2r3c1">
                            <h2>Thông tin định danh</h2>
                            <h3>Họ và tên:</h3>
                            <p>{currentRequestSupport?.fullName}</p>

                            <h3>Ngày sinh:</h3>
                            <p>{formatDater(String(currentRequestSupport?.dateOfBirth))}</p> {/* Định dạng ngày sinh */}

                            <h3>Số CCCD:</h3>
                            <p>{currentRequestSupport?.citizenId}</p>

                            <h3>Ảnh CMND:</h3>
                            {currentRequestSupport?.citizenIdImages?.map((image, index) => (
                                <img key={index} src={image} alt={`Citizen ID ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                            ))}

                            <h2>Thông tin liên hệ</h2>

                            <h3>Email:</h3>
                            <p>{currentRequestSupport?.email}</p>

                            <h3>Số điện thoại:</h3>
                            <p>{currentRequestSupport?.phoneNumber}</p>

                            <h3>Địa chỉ:</h3>
                            <p>{currentRequestSupport?.address}</p>

                            <h3>Liên hệ chính quyền địa phương:</h3>
                            <p>{currentRequestSupport?.localAuthorityContact}</p>

                            <h3>Liên hệ người thân:</h3>
                            <p>{currentRequestSupport?.relativeContact}</p>

                            <h2>Hoàn cảnh và lý do hỗ trợ</h2>

                            <h3>Lý do cần hỗ trợ:</h3>
                            <p style={{ whiteSpace: "pre-line" }}>{currentRequestSupport?.reason}</p>

                            <h3>Số người trong hộ gia đình:</h3>
                            <p>{currentRequestSupport?.householdSize}</p>

                            {currentRequestSupport?.specialMembers && (
                                <>
                                    <h3>Trường hợp đặc biết:</h3>
                                    <p>{currentRequestSupport?.specialMembers}</p>
                                </>
                            )}

                            {currentRequestSupport?.localAuthorityConfirmation && (
                                <>
                                    <h3>Giấy xác nhận từ chính quyền địa phương:</h3>
                                    <p>{currentRequestSupport?.localAuthorityConfirmation}</p>
                                </>
                            )}

                            <h3>Hình ảnh hoàn cảnh gia đình:</h3>
                            {currentRequestSupport?.circumstanceImages?.map((image, index) => (
                                <img key={index} src={image} alt={`Circumstance ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                            ))}
                        </div>
                        <div className="sdncr2r3c2">
                            <h2>Thông tin tài chính</h2>

                            <h3>Nguồn thu nhập:</h3>
                            <p>{currentRequestSupport?.incomeSource}</p>

                            <h3>Thu nhập hàng tháng:</h3>
                            <p>{currentRequestSupport?.monthlyIncome.toLocaleString()}</p>

                            <h2>Thông tin tài chính</h2>

                            <h3>Thực phẩm yêu cầu:</h3>
                            {currentRequestSupport?.requestedItems?.map((product, index) => (
                                <p key={index}>{product}</p>
                            ))}

                            <h2>Lịch sử nhận hỗ trợ</h2>

                            <h3>Đã nhận hỗ trợ trước đó:</h3>
                            <p>{currentRequestSupport?.hasReceivedSupportBefore ? "Có" : "Không"}</p>

                            <h3>Chi tiết hỗ trợ trước đó:</h3>
                            <p>{currentRequestSupport?.previousSupportDetails || "Chưa có"}</p>

                            <h2>Cam kết minh bạch</h2>

                            <h3>Cam kết tính chính xác:</h3>
                            <p>{currentRequestSupport?.commitmentToAccuracy ? "Đã cam kết" : "Chưa cam kết"}</p>

                            <h3>Chữ ký:</h3>
                            {currentRequestSupport?.signatureImage && <img src={currentRequestSupport.signatureImage} alt="Signature" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
                        </div>
                    </div>
                    <div className="sdncr2r4" style={{ margin: "20px 0" }}>
                        <button className="approve-btn" onClick={() => setIsRequestDonorModal(true)}>Yêu cầu hỗ trợ</button>
                    </div>
                    <h1>Danh sách gửi hỗ trợ</h1>
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Họ và tên
                                </th>
                                <th className="table-head-cell">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {currentRequestSupport && currentRequestSupport?.supportDonors?.map((item, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>{item.fullName}</td>
                                    <td className='table-body-cell'>{item.status === "Participating" ? "Đã tham gia" : "Chưa tham gia"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <RequestDonorModal isOpen={isRequestDonorModal} setIsOpen={setIsRequestDonorModal} requestSupportId={currentRequestSupport?.requestSupportId} donorSupport={currentRequestSupport?.supportDonors} />
        </section>
    )
}

export default StaffDetailRequestSupportPage