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
        <section id="staff-detail-request-support" className="staff-section">
            <div className="staff-container sdrs-container">
                <div className="sdrscr1">
                    <h1>Đơn yêu cầu hỗ trợ</h1>
                    <p>Trang tổng quát<span className="staff-tag">Chi tiết đơn yêu cầu hỗ trợ</span></p>
                </div>
                <div className="sdrscr2">
                    <div className="sdrscr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.request_support.list)}>Quay lại danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdrscr2r2">
                        <div className="sdrscr2r2c1">
                        </div>
                        <div className="sdrscr2r2c2">
                            <h3>Ngày tạo:</h3>
                            <p>{formatDater(String(createDate))}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdrscr2r3">
                        <h2>Thông tin định danh</h2>
                        <h3>Họ và tên: <span>{currentRequestSupport?.fullName}</span></h3>
                        <h3>Ngày sinh: <span>{formatDater(String(currentRequestSupport?.dateOfBirth))}</span></h3>

                        <h3>Ảnh CMND:</h3>
                        {currentRequestSupport?.citizenIdImages?.map((image, index) => (
                            <img key={index} src={image} alt={`Citizen ID ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                        ))}

                        <h2>Thông tin liên hệ</h2>

                        <h3>Email: <span>{currentRequestSupport?.email}</span></h3>

                        <h3>Số điện thoại: <span>{currentRequestSupport?.phoneNumber}</span></h3>

                        <h3>Địa chỉ: <span>{currentRequestSupport?.address}</span></h3>

                        <h2>Hoàn cảnh và lý do hỗ trợ</h2>

                        <h3>Lý do cần hỗ trợ: <span style={{ whiteSpace: "pre-line" }}>{currentRequestSupport?.reason}</span></h3>


                        <h3>Số người nhận hỗ trợ: <span>{currentRequestSupport?.householdSize}</span></h3>

                        {/* {currentRequestSupport?.specialMembers && (
                            <>
                                <h3>Trường hợp đặc biết: <span>{currentRequestSupport?.specialMembers}</span></h3>
                            </>
                        )} */}

                        {currentRequestSupport?.circumstanceImages && (
                            <>
                                <h3>Hình ảnh hoàn cảnh gia đình:</h3>
                                {currentRequestSupport?.circumstanceImages?.map((image, index) => (
                                    <img key={index} src={image} alt={`Circumstance ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                                ))}
                            </>
                        )}

                        <h3>Thực phẩm yêu cầu:</h3>
                        {currentRequestSupport?.requestedItems?.map((product, index) => (
                            <p key={index}>{product}</p>
                        ))}
                    </div>
                    <div className="sdrscr2r4" style={{ margin: "20px 0" }}>
                        <button className="sc-btn" onClick={() => setIsRequestDonorModal(true)}>Xử lý yêu cầu</button>
                    </div>
                </div>
            </div>
            <RequestDonorModal isOpen={isRequestDonorModal} setIsOpen={setIsRequestDonorModal} requestSupportId={currentRequestSupport?.requestSupportId} donorSupport={currentRequestSupport?.supportDonors} />
        </section>
    )
}

export default StaffDetailRequestSupportPage