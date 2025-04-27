import { selectGetProfileUser } from "@/app/selector"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { setLoading } from "@/services/app/appSlice"
import { getProfileApiThunk } from "@/services/user/userThunk"
import { formatDater } from "@/utils/helper"
import { FC, useEffect } from "react"
import { useParams } from "react-router-dom"

const AdminDetailStaffPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch()
    const userProfile = useAppSelector(selectGetProfileUser)

    const createdDate = userProfile?.createdDate && userProfile?.createdDate.split("T")[0];

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getProfileApiThunk(String(id)))
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
    }, [id])

    return (
        <section id="admin-detail-staff" className="admin-section">
            <div className="admin-container ads-container">
                <div className="adscr1">
                    <h1>Nhân viên</h1>
                    <p>Trang tổng quan<span className="admin-tag">Thông tin nhân viên</span></p>
                </div>
                <div className="adscr2">
                    <div className="adscr2r1">
                        <h2></h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.admin.staff.list)}>Quay lại trang danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="adscr2r2">
                        <div className="adscr2r2c1">
                        </div>
                        <div className="adscr2r2c2">
                            <h3>Ngày tạo:</h3>
                            <p>{formatDater(String(createdDate))}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="adscr2r3">
                        <div className="adscr2r3c1">
                            <h3>Tên nhân viên:</h3>
                            <p>{userProfile?.fullName}</p>
                            <h3>Email nhân viên:</h3>
                            <p>{userProfile?.email}</p>
                            <h3>Số điện thoại nhân viên</h3>
                            <p>{userProfile?.phone}</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default AdminDetailStaffPage