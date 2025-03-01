import { ActiveIcon, BlockIcon, TotalIcon } from "@/assets/icons"

const AdminListStaffPage = () => {
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
                    <button className="admin-add-btn">Add Staff</button>
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
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            <tr className="table-body-row">
                                <td className='table-body-cell'>1</td>
                                <td className='table-body-cell'>A</td>
                                <td className='table-body-cell'>7/1</td>
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