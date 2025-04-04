import { selectCurrentCampaign, selectGetAllRegisterReceivers } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice';
import { getCampaignByIdApiThunk } from '@/services/campaign/campaignThunk';
import { getAllRegisterReceiversApiThunk } from '@/services/registerReceive/registerReceiveThunk';
import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const AdminDetailCampaignPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const currentCampaign = useAppSelector(selectCurrentCampaign);

    const registerReceivers = useAppSelector(selectGetAllRegisterReceivers);

    const currentRegisterReceivers = registerReceivers.filter((registerReceiver) => registerReceiver.campaignId === id);

    const date = currentCampaign?.implementationTime.split("T")[0];
    const dateCreate = currentCampaign?.createdDate.split("T")[0];
    const time = currentCampaign?.implementationTime.split("T")[1].replace("Z", "");

    useEffect(() => {
        if (id) {
            dispatch(setLoading(true));
            dispatch(getAllRegisterReceiversApiThunk());
            dispatch(getCampaignByIdApiThunk(id))
                .unwrap()
                .catch(() => {
                }).finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                });
        }
    }, [id, dispatch])

    return (
        <section id="admin-detail-campaign" className="admin-section">
            <div className="admin-container adc-container">
                <div className="adccr1">
                    <h1>Campain</h1>
                    <p>Dashboard<span className="admin-tag">Detail Campain</span></p>
                </div>
                <div className="adccr2">
                    <div className="adccr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.admin.campaign.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="adccr2r2">
                        <div className="sdcucr2r2c1">
                            <h3>Campaign Status:</h3>
                            <p>{currentCampaign?.status}</p>
                        </div>
                        <div className="sdcucr2r2c2">
                            <h3>Created Date:</h3>
                            <p>{dateCreate}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="adccr2r3">
                        <div className="adccr2r3c1">
                            <h3>Campaign Name:</h3>
                            <p>{currentCampaign?.nameCampaign}</p>
                            <h3>Campaign Description:</h3>
                            <p>{currentCampaign?.description}</p>
                            <h3>Gift Quantity:</h3>
                            <p>{currentCampaign?.giftQuantity}</p>
                            <h3>Gift Type:</h3>
                            <p>{currentCampaign?.giftType}</p>
                        </div>
                        <div className="adccr2r3c2">
                            <h3>Receive Date:</h3>
                            <p>{date}</p>
                            <h3>Receive Time:</h3>
                            <p>{time}</p>
                        </div>
                    </div>
                    {currentCampaign?.status === "Approved" && (
                        <div className="adccr2r3">
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">
                                            Name Receiver
                                        </th>
                                        <th className="table-head-cell">
                                            Quantity
                                        </th>
                                        <th className="table-head-cell">
                                            Register Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {currentRegisterReceivers.map((registerReceiver, index) => (
                                        <tr className="table-body-row" key={index}>
                                            <td className='table-body-cell'>{registerReceiver.registerReceiverName}</td>
                                            <td className='table-body-cell'>{registerReceiver.quantity}</td>
                                            <td className='table-body-cell'>{registerReceiver.creatAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AdminDetailCampaignPage