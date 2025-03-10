import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { FC } from 'react'

const StaffDetailCampaignStaffPage: FC = () => {
    return (
        <section id="staff-detail-campaign-staff" className="staff-section">
            <div className="staff-container sdcs-container">
                <div className="sdcscr1">
                    <h1>Staff's Campain</h1>
                    <p>Dashboard<span className="staff-tag">Detail Staff's Campain</span></p>
                </div>
                <div className="sdcscr2">
                    <div className="sdcscr2r1">
                        <h2>#1</h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.campaign.staff.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcscr2r2">
                        <div className="sdcscr2r2c1">
                            <h3>Staff Status:</h3>
                            <p>Active</p>
                        </div>
                        <div className="sdcscr2r2c2">
                            <h3>Created Date:</h3>
                            <p>25-02-2025</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcscr2r3">
                        <div className="sdcscr2r3c1">
                            <h3>Staff Name:</h3>
                            <p>Nguyen Van A</p>
                            <h3>Staff Email:</h3>
                            <p>a@gmail.com</p>
                            <h3>Staff Phone:</h3>
                            <p>001203031</p>
                        </div>
                        <div className="sdcscr2r3c2">
                            <h3>Staff Address:</h3>
                            <p>Da Nang</p>
                            <h3>Staff Birth Day:</h3>
                            <p>21-7-2000</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default StaffDetailCampaignStaffPage