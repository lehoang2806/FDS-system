import { ActiveIcon, BlockIcon, TotalIcon } from "@/assets/icons"
import { SlideToggle } from "@/components/Elements"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"

const AdminListStaffPage = () => {
    const handleToDetail = (campaignId: string) => {
        const url = routes.admin.staff.detail.replace(":id", campaignId);
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
                                    ID
                                </th>
                                <th className="table-head-cell">
                                    Name
                                </th>
                                <th className="table-head-cell">
                                    Create Date
                                </th>
                                <th className="table-head-cell">
                                    Active
                                </th>
                                <th className="table-head-cell">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            <tr className="table-body-row">
                                <td className='table-body-cell'>1</td>
                                <td className='table-body-cell'>A</td>
                                <td className='table-body-cell'>7/1</td>
                                <td className='table-body-cell'>
                                    <SlideToggle />
                                </td>
                                <td className="table-body-cell">
                                    <button onClick={() => handleToDetail("1")}>view</button>
                                </td>
                            </tr>
                            <tr className="table-body-row">
                                <td className='table-body-cell'>1</td>
                                <td className='table-body-cell'>A</td>
                                <td className='table-body-cell'>7/1</td>
                                <td className='table-body-cell'>
                                    <SlideToggle />
                                </td>
                                <td className="table-body-cell">
                                    H
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default AdminListStaffPage