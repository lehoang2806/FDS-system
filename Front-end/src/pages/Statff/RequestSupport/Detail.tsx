import { selectGetRequestSupportById } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getRequestSupportByIdApiThunk } from '@/services/requestSupport/requestSupportThunk'
import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const StaffDetailRequestSupportPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch =useAppDispatch();
    const currentRequestSupport = useAppSelector(selectGetRequestSupportById)

    const createDate = currentRequestSupport?.createdDate && currentRequestSupport?.createdDate.split("T")[0];
    const birthday = currentRequestSupport?.dateOfBirth && currentRequestSupport?.dateOfBirth.split("T")[0];

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
                            <p>{createDate}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdncr2r3">
                        <div className="sdncr2r3c1">
                            <h3>Họ và tên:</h3>
                            <p>{currentRequestSupport?.fullName}</p>
                            <h3>Email:</h3>
                            <p>{currentRequestSupport?.email}</p>
                            <h3>Số điện thoại:</h3>
                            <p>{currentRequestSupport?.phoneNumber}</p>
                            <h3>Ngày sinh:</h3>
                            <p>{birthday}</p>
                            <h3>Địa chỉ:</h3>
                            <p>{currentRequestSupport?.address}</p>
                            <h3>Lý do cần hỗ trợ</h3>
                            <p style={{ whiteSpace: "pre-line" }}>{currentRequestSupport?.reason}</p>
                            <h3>Thực phẩm yêu cầu</h3>
                            {currentRequestSupport?.requestedItems?.map((product, index) => {
                                return (
                                    <p key={index}>{product}</p>
                                )
                            })}
                        </div>
                        <div className="sdncr2r3c2">
                            <h3>Số ngừoi trong gia đình</h3>
                            <p>{currentRequestSupport?.householdSize}</p>
                            <h3>Nguồn thu nhập chính:</h3>
                            <p>{currentRequestSupport?.incomeSource}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffDetailRequestSupportPage