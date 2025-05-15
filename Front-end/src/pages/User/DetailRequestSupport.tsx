import { selectGetRequestSupportById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setLoading } from "@/services/app/appSlice";
import { getRequestSupportByIdApiThunk } from "@/services/requestSupport/requestSupportThunk";
import { formatDater } from "@/utils/helper";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailRequestSupport = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
    const currentRequestSupport = useAppSelector(selectGetRequestSupportById)

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
        <section id="detail-request-support">
            <div className="drs-container">
                <h1>Chi tiết đơn yêu cầu hỗ trợ</h1>
                <div className="drsr2">
                    <div className="col-flex drsr2c1">
                        <h2>Thông tin định danh</h2>
                        <h3>Họ và tên:</h3>
                        <p>{currentRequestSupport?.fullName}</p>

                        <h3>Ngày sinh:</h3>
                        <p>{formatDater(String(currentRequestSupport?.dateOfBirth))}</p> {/* Định dạng ngày sinh */}

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

                        <h3>Hình ảnh hoàn cảnh gia đình:</h3>
                        {currentRequestSupport?.circumstanceImages?.map((image, index) => (
                            <img key={index} src={image} alt={`Circumstance ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                        ))}
                    </div>
                    <div className="col-flex drsr2c2">

                        <h2>Thông tin tài chính</h2>

                        <h3>Thực phẩm yêu cầu:</h3>
                        {currentRequestSupport?.requestedItems?.map((product, index) => (
                            <p key={index}>{product}</p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailRequestSupport