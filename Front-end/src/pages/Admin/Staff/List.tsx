import { selectGetAllUser } from "@/app/selector"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { ActiveIcon, BlockIcon, TotalIcon } from "@/assets/icons"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { getAllUserApiThunk } from "@/services/user/userThunk"
import { useEffect } from "react"

const AdminListStaffPage = () => {
    const dispatch = useAppDispatch();

    const users = useAppSelector(selectGetAllUser);
    const accountStaffs = users.filter(user => user.roleId === 2);

    useEffect(() => {
        dispatch(getAllUserApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
            });
    }, []);

    const handleToDetail = (staffId: string) => {
        const url = routes.admin.staff.detail.replace(":id", staffId);
        return navigateHook(url)
    }

    return (
        <section id="admin-list-staff" className="admin-section">
            <div className="admin-container als-container">
                <div className="alscr1">
                    <h1>Staff</h1>
                    <p>Dashboard<span className="admin-tag">Staff</span></p>
                </div>
                <div className="alscr2">
                    <div className="admin-tab admin-tab-1">
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Total</h3>
                            <p>7 Staff</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-2">
                        <div className="at-figure at-figure-2">
                            <BlockIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Forbidden</h3>
                            <p>7 Staff</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-3">
                        <div className="at-figure at-figure-3">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Active</h3>
                            <p>7 Staff</p>
                        </div>
                    </div>
                </div>
                <div className="alscr3">
                    <button className="admin-add-btn" onClick={() => navigateHook(routes.admin.staff.add)}>Add Staff</button>
                </div>
                <div className="alscr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Email
                                </th>
                                <th className="table-head-cell">
                                    Full Name
                                </th>
                                <th className="table-head-cell">
                                    Phone
                                </th>
                                <th className="table-head-cell">
                                    Address
                                </th>
                                <th className="table-head-cell">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {accountStaffs.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className='table-body-cell'>{row.email}</td>
                                    <td className='table-body-cell'>{row.fullName}</td>
                                    <td className='table-body-cell'>{row.phone}</td>
                                    <td className='table-body-cell'>{row.address}</td>
                                    <td className="table-body-cell">
                                        <button className="view-btn" onClick={() => handleToDetail(row.id)}>View</button>
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