import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { FC } from "react"

const StaffDetailUserPage: FC = () => {
    return (
        <section id="staff-detail-user" className="staff-section">
            <div className="staff-container sdu-container">
                <div className="sducr1">
                    <h1>User</h1>
                    <p>Dashboard<span className="staff-tag">Detail User</span></p>
                </div>
                <div className="sducr2">
                    <div className="sducr2r1">
                        <h2>#1</h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.user.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sducr2r2">
                        <div className="sducr2r2c1">
                            <h3>User Status:</h3>
                            <p>Active</p>
                        </div>
                        <div className="sducr2r2c2">
                            <h3>Created Date:</h3>
                            <p>25-02-2025</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sducr2r3">
                        <div className="sducr2r3c1">
                            <h3>User Name:</h3>
                            <p>Nguyen Van A</p>
                            <h3>User Email:</h3>
                            <p>a@gmail.com</p>
                            <h3>User Phone:</h3>
                            <p>001203031</p>
                        </div>
                        <div className="sducr2r3c2">
                            <h3>User Address:</h3>
                            <p>Da Nang</p>
                            <h3>User Birth Day:</h3>
                            <p>21-7-2000</p>
                            <h3>User Role:</h3>
                            <p>Donor</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffDetailUserPage