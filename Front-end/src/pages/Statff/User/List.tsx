import { ActiveIcon, BlockIcon, TotalIcon } from "@/assets/icons"
import { SlideToggle } from "@/components/Elements"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"

const StaffListUserPage = () => {
    const handleToDetail = (campaignId: string) => {
        const url = routes.staff.user.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <section id="staff-list-user" className="staff-section">
            <div className="staff-container slu-container">
                <div className="slucr1">
                    <h1>User</h1>
                    <p>Dashboard<span className="staff-tag">User</span></p>
                </div>
                <div className="slucr2">
                    <div className="staff-tab staff-tab-1">
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Total</h3>
                            <p>7 Users</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2">
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Forbidden</h3>
                            <p>7 Users</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3">
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Donor</h3>
                            <p>7 Users</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4">
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Recipient</h3>
                            <p>7 Users</p>
                        </div>
                    </div>
                </div>
                <div className="slucr3">
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
                                    <button onClick={() => handleToDetail("1")} className="view-btn">view</button>
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

export default StaffListUserPage