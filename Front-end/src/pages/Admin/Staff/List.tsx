import { selectGetAllUser } from "@/app/selector"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { TotalIcon } from "@/assets/icons"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { setLoading } from "@/services/app/appSlice"
import { getAllUserApiThunk } from "@/services/user/userThunk"
import { useEffect } from "react"

const AdminListStaffPage = () => {
    const dispatch = useAppDispatch();

    const users = useAppSelector(selectGetAllUser);
    const accountStaffs = users.filter(user => user.roleId === 2);

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllUserApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch]);

    const handleToDetail = (staffId: string) => {
        const url = routes.admin.staff.detail.replace(":id", staffId);
        return navigateHook(url)
    }

    return (
        <section id="admin-list-staff" className="admin-section">
            <div className="admin-container als-container">
                <div className="alscr1">
                    <h1>Nhân viên</h1>
                    <p>Trang tổng quan<span className="admin-tag">Nhân viên</span></p>
                </div>
                <div className="alscr2">
                    <div className="admin-tab admin-tab-1">
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Tổng cộng</h3>
                            <p>{accountStaffs.length} Nhân viên</p>
                        </div>
                    </div>
                </div>
                <div className="alscr3">
                    <button className="admin-add-btn" onClick={() => navigateHook(routes.admin.staff.add)}>Tạo nhân viên mới</button>
                </div>
                <div className="alscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Email
                                </th>
                                <th className="table-head-cell">
                                    Họ và tên
                                </th>
                                <th className="table-head-cell">
                                    Số điện thoại
                                </th>
                                <th className="table-head-cell">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {accountStaffs.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className='table-body-cell'>{row.email}</td>
                                    <td className='table-body-cell'>{row.fullName}</td>
                                    <td className='table-body-cell'>{row.phone}</td>
                                    <td className="table-body-cell">
                                        <button className="view-btn" onClick={() => handleToDetail(row.accountId)}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default AdminListStaffPage