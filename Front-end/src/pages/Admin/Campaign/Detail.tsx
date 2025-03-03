import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { FC } from 'react'

const AdminDetailCampaignPage: FC = () => {
    return (
        <section id="admin-detail-campaign" className="admin-section">
            <div className="admin-container adc-container">
                <div className="adccr1">
                    <h1>Campain</h1>
                    <p>Dashboard<span className="admin-tag">Detail Campain</span></p>
                </div>
                <div className="adccr2">
                    <div className="adccr2r1">
                        <h2>#1</h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.admin.campaign.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="adccr2r2">
                        <div className="adccr2r2c1">
                            <h3>Donor Status:</h3>
                            <p>Active</p>
                        </div>
                        <div className="adccr2r2c2">
                            <h3>Created Date:</h3>
                            <p>25-02-2025</p>
                        </div>
                    </div>
                    <hr />
                    <div className="adccr2r3">
                        <div className="adccr2r3c1">
                            <h3>Donor Name:</h3>
                            <p>Nguyen Van A</p>
                            <h3>Donor Email:</h3>
                            <p>a@gmail.com</p>
                            <h3>Donor Phone:</h3>
                            <p>001203031</p>
                        </div>
                        <div className="adccr2r3c2">
                            <h3>Donor Address:</h3>
                            <p>Da Nang</p>
                            <h3>Donor Birth Day:</h3>
                            <p>21-7-2000</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default AdminDetailCampaignPage