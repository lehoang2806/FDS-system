import { selectGetProfileUser } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { setLoading } from "@/services/app/appSlice";
import { getProfileApiThunk } from "@/services/user/userThunk";
import { FC, useEffect } from "react"
import { useParams } from "react-router-dom";
import { format } from 'date-fns';

const StaffDetailUserPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const userProfile = useAppSelector(selectGetProfileUser)

    const createdDate = userProfile?.createdDate && userProfile?.createdDate.split("T")[0];

    useEffect(() => {
        if (id) {
            dispatch(setLoading(true))
            dispatch(getProfileApiThunk(id))
                .unwrap()
                .then(() => {
                })
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false))
                    }, 1000)
                })
        }
    }, [id])

    return (
        <section id="staff-detail-user" className="staff-section">
            <div className="staff-container sdu-container">
                <div className="sducr1">
                    <h1>Người dùng</h1>
                    <p>Dashboard<span className="staff-tag">Chi tiết người dùng</span></p>
                </div>
                <div className="sducr2">
                    <div className="sducr2r1">
                        <h2></h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.user.list)}>Quay về danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sducr2r2">
                        <div className="sducr2r2c1">
                            <h3>Trạng thái tài khoản:</h3>
                            <p>{userProfile?.isConfirm ? "Đã được xác minh" : "Chưa được xác minh"}</p>
                        </div>
                        <div className="sducr2r2c2">
                            <h3>Ngày đăng ký:</h3>
                            <p>
                                {createdDate ? format(new Date(createdDate), 'dd/MM/yyyy') : ''}
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="sducr2r3">
                        <div className="sducr2r3c1">
                            <h3>Họ và têm:</h3>
                            <p>Nguyen Van A</p>
                            <h3>Email:</h3>
                            <p>a@gmail.com</p>
                            <h3>Số điện thoại:</h3>
                            <p>001203031</p>
                        </div>
                        <div className="sducr2r3c2">
                            {userProfile?.address && (
                                <>
                                    <h3>Đại điểm:</h3>
                                    <p>{userProfile.address}</p>
                                </>
                            )}
                            {userProfile?.birthDay && (
                                <>
                                    <h3>Ngày sinh:</h3>
                                    <p>{userProfile.birthDay}</p>
                                </>
                            )}
                            <h3>Vai trò:</h3>
                            <p>{userProfile?.roleId === 3 ? "Người hiến tặng thực phẩm" : "Người nhận hỗ trợ"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffDetailUserPage