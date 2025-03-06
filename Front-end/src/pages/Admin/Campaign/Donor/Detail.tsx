import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { FC } from 'react'

const AdminDetailCampaignDonorPage: FC = () => {
    return (
        <section id="admin-detail-campaign-donor" className="admin-section">
            <div className="admin-container adcd-container">
                <div className="adcdcr1">
                    <h1>Donor's Campain</h1>
                    <p>Dashboard<span className="admin-tag">Detail Donor's Campain</span></p>
                </div>
                <div className="adcdcr2">
                    <div className="adcdcr2r1">
                        <h2>#1</h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.admin.campaign.donor.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="adcdcr2r2">
                        <div className="adcdcr2r2c1">
                            <h3>Donor Status:</h3>
                            <p>Active</p>
                        </div>
                        <div className="adcdcr2r2c2">
                            <h3>Created Date:</h3>
                            <p>25-02-2025</p>
                        </div>
                    </div>
                    <hr />
                    <div className="adcdcr2r3">
                        <div className="adcdcr2r3c1">
                            <h3>Donor Name:</h3>
                            <p>Nguyen Van A</p>
                            <h3>Donor Email:</h3>
                            <p>a@gmail.com</p>
                            <h3>Donor Phone:</h3>
                            <p>001203031</p>
                        </div>
                        <div className="adcdcr2r3c2">
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

export default AdminDetailCampaignDonorPage