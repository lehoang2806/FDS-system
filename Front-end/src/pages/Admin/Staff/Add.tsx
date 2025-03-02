import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { FC } from "react"

const AdminAddStaffPage: FC = () => {
    return (
        <section id="admin-add-staff" className="admin-section">
            <div className="admin-container aas-container">
                <div className="aascr1">
                    <h1>Staff</h1>
                    <p>Dashboard<span className="admin-tag">Add Staff</span></p>
                </div>
                <div className="aascr2">
                    <div className="aascr2r1">
                        <h2>#1</h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.admin.staff.list)}>Cancel</button>
                            <button>Create Staff</button>
                        </div>
                    </div>
                    <hr />
                    <div className="aascr2r2">
                        <div className="aascr2r2c1">
                            <h3>Staff Status:</h3>
                            <p>Active</p>
                        </div>
                        <div className="aascr2r2c2">
                            <h3>Created Date:</h3>
                            <p>25-02-2025</p>
                        </div>
                    </div>
                    <hr />
                    <div className="aascr2r3">
                        <form className="form">
                            <div className="form-field">
                                <label className="form-label">Email</label>
                                <input type="text" className="form-input" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-input" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Password</label>
                                <input type="text" className="form-input" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Confirm Password</label>
                                <input type="text" className="form-input" />
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default AdminAddStaffPage