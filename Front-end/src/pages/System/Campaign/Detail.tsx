import { selectCurrentCampaign, selectGetAllCampaign, selectGetAllRegisterReceivers, selectUserLogin } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { CampaignCard } from '@/components/Card/index';
import { Subscriber } from '@/components/Elements/index'
import { RegisterReceiverModal, RemindCertificateModal } from '@/components/Modal';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { setLoading } from '@/services/app/appSlice';
import { getAllCampaignApiThunk, getCampaignByIdApiThunk } from '@/services/campaign/campaignThunk';
import { getAllRegisterReceiversApiThunk } from '@/services/registerReceive/registerReceiveThunk';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

const DetailCampaignPage: React.FC = () => {
    const userLogin = useAppSelector(selectUserLogin);

    const [activeTab, setActiveTab] = useState<"mota" | "dangky">("mota");

    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const currentCampaign = useAppSelector(selectCurrentCampaign);

    const campaigns = useAppSelector(selectGetAllCampaign)

    const approvedCampaigns = campaigns.filter((campaign) => campaign.status === "Approved");

    const otherCampaigns = approvedCampaigns.filter((campaign) => campaign.campaignId !== id);

    const [isRemindCertificateModalOpend, setIsRemindCertificateModalOpend] = useState(false);

    const [isRegisterReceiverModalOpend, setIsRegisterReceiverModalOpend] = useState(false);

    const registerReceivers = useAppSelector(selectGetAllRegisterReceivers);

    const currentRegisterReceivers = registerReceivers.filter((registerReceiver) => registerReceiver.campaignId === id);

    const registeredReceiver = currentRegisterReceivers.find((registerReceiver) => registerReceiver.accountId === userLogin?.accountId);

    const handleToDetail = (campaignId: string) => {
        const url = routes.user.campaign.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch])

    const date = currentCampaign?.receiveDate.split("T")[0];
    const time = currentCampaign?.receiveDate.split("T")[1].replace("Z", "");

    useEffect(() => {
        if (id) {
            dispatch(setLoading(true));
            dispatch(getAllRegisterReceiversApiThunk())
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

    const handleRegisterReceiver = () => {
        if (registeredReceiver) {
            alert("Bạn đã đăng ký rồi")
        }
        else {
            setIsRegisterReceiverModalOpend(true);
        }
    }

    return (
        <main id="detail-campaign">
            <section id="dc-section">
                <div className="dcs-container">
                    <div className="dcscr1">
                        <div className="dcscr1c1">
                            <div className="dcscr1c1r1">
                                <h1>{currentCampaign?.nameCampaign}</h1>
                            </div>
                            <div className="dcscr1c1r3">
                                <div
                                    className={`dcscr1c1r3-tags-item ${activeTab === "mota" ? "dcscr1c1r3-tags-item-actived" : ""}`}
                                    onClick={() => setActiveTab("mota")}
                                >
                                    Mô tả
                                </div>
                            </div>
                            <div className="dcscr1c1r4">
                                <div className="dcscr1c1r4-content">{currentCampaign?.description}</div>
                            </div>
                        </div>
                        <div className="dcscr1c2">
                            <div className="dcscr1c2r1">
                                <div>
                                    <h4>Phần quà</h4>
                                    <p>{currentCampaign?.giftQuantity} - {currentCampaign?.giftType}</p>
                                </div>
                                <div>
                                    <h4>Thời gian & Địa điểm</h4>
                                    <p>{currentCampaign?.address}</p>
                                    <p>{date} - {time}</p>
                                </div>
                                {userLogin?.roleId === 4 && (
                                    <button className='sc-btn' onClick={handleRegisterReceiver}>Đăng ký nhận hỗ trợ</button>
                                )}
                            </div>
                            {currentCampaign?.status === "Approved" && (
                                <div className="dcscr1c2r2">
                                    <h3>Danh sách dăng ký nhận hỗ trợ</h3>
                                    <div className="dcscr1c2r2-lists">
                                        {currentRegisterReceivers.length > 0 ? (
                                            currentRegisterReceivers.map((registerReceiver) => (
                                                <Subscriber key={registerReceiver.registerReceiverId} registerReceiver={registerReceiver} />
                                            ))
                                        ) : (
                                            <h1>Chưa có người đăng ký</h1>
                                        )
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {currentCampaign?.status === "Rejected" && (
                        <p>{currentCampaign.rejectComment}</p>
                    )}
                    {currentCampaign?.status === "Approved" && (
                        <>
                            <div className="line"></div>
                            <div className="dcscr2">
                                <div className="dcscr2r1">
                                    <h2>Các chiến dịch khác</h2>
                                    <Link to={routes.user.campaign.list}>Xem tất cả</Link>
                                </div>
                                <div className="dcscr2r2">
                                    {otherCampaigns.length > 0 ? (
                                        otherCampaigns.map((campaign) => (
                                            <CampaignCard
                                                campaign={campaign}
                                                key={campaign.campaignId}
                                                onClickDetail={() => handleToDetail(campaign.campaignId)}
                                            />
                                        ))
                                    ) : (
                                        <h1>Chưa có dữ liệu</h1>
                                    )
                                    }
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <RemindCertificateModal isOpen={isRemindCertificateModalOpend} setIsOpen={setIsRemindCertificateModalOpend} />
            <RegisterReceiverModal isOpen={isRegisterReceiverModalOpend} setIsOpen={setIsRegisterReceiverModalOpend} campaignId={id} />
        </main>
    )
}

export default DetailCampaignPage