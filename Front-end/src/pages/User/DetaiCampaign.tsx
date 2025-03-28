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

const UserDetailCampaignPage: React.FC = () => {
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

    const [selectedImage, setSelectedImage] = useState(currentCampaign?.images?.[0] || "")

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

    const date = currentCampaign?.implementationTime.split("T")[0];
    const time = currentCampaign?.implementationTime.split("T")[1].replace("Z", "");

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

    useEffect(() => {
        if (currentCampaign?.images && currentCampaign.images.length > 0) {
            setSelectedImage(currentCampaign.images[0]);
        }
    }, [JSON.stringify(currentCampaign?.images)]);

    const handleRegisterReceiver = () => {
        if (registeredReceiver) {
            alert("Bạn đã đăng ký rồi")
        }
        else {
            setIsRegisterReceiverModalOpend(true);
        }
    }

    return (
        <main id="user-detail-campaign">
            <section id="udc-section">
                <div className="udcs-container">
                    <div className="udcscr1">
                        <div className="udcscr1c1">
                            <div className="udcscr1c1r1">
                                <h1>{currentCampaign?.campaignName} - <span>{currentCampaign?.status}</span></h1>
                            </div>
                            <div className="udcscr1c1r3">
                                <div
                                    className={`udcscr1c1r3-tags-item ${activeTab === "mota" ? "udcscr1c1r3-tags-item-actived" : ""}`}
                                    onClick={() => setActiveTab("mota")}
                                >
                                    Mô tả
                                </div>
                            </div>
                            <div className="udcscr1c1r4">
                                <div className="udcscr1c1r4-content">{currentCampaign?.campaignDescription}</div>
                            </div>
                            <div className="udcscr1c1r4">
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt="Selected Campaign Image"
                                        style={{
                                            width: "400px",
                                            height: "400px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            marginBottom: "10px"
                                        }}
                                    />
                                )}
                            </div>
                            <div className="udcscr1c1r4">
                                {currentCampaign?.images?.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Campaign Image ${index + 1}`}
                                        onClick={() => setSelectedImage(img)}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            margin: "5px",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                            border: selectedImage === img ? "3px solid blue" : "2px solid gray",
                                            transition: "0.3s"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="udcscr1c2">
                            <div className="udcscr1c2r1">
                                <div>
                                    <h4>Phần quà</h4>
                                    <p>{currentCampaign?.limitedQuantity} - {currentCampaign?.typeGift}</p>
                                </div>
                                <div>
                                    <h4>Thời gian & Địa điểm</h4>
                                    <p>{currentCampaign?.location}</p>
                                    <p>{date}</p>
                                    <p>{time}</p>
                                </div>
                                {userLogin?.roleId === 4 && (
                                    <button className='sc-btn' onClick={handleRegisterReceiver}>Đăng ký nhận hỗ trợ</button>
                                )}
                            </div>
                            {currentCampaign?.status === "Approved" && (
                                <div className="udcscr1c2r2">
                                    <h3>Danh sách dăng ký nhận hỗ trợ</h3>
                                    <div className="udcscr1c2r2-lists">
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
                            {currentCampaign?.status === "Pending" && (
                                <>
                                    <div className="sdcucr2r5">
                                        <h3>Cần bổ sung các thông tin sau:</h3>
                                        {currentCampaign.reviewComments?.map((comment, index) => (
                                            <p key={index} style={{ whiteSpace: "pre-line" }}>{comment.content}</p>
                                        ))}
                                    </div>
                                </>
                            )}
                            {currentCampaign?.status === "Rejected" && (
                                <>
                                    <h3>Lí do bị từ chối</h3>
                                    <p>{currentCampaign.rejectComment}</p>
                                </>
                            )}
                        </div>
                    </div>
                    {currentCampaign?.status === "Approved" && (
                        <>
                            <div className="line"></div>
                            <div className="udcscr2">
                                <div className="udcscr2r1">
                                    <h2>Các chiến dịch khác</h2>
                                    <Link to={routes.user.campaign.list}>Xem tất cả</Link>
                                </div>
                                <div className="udcscr2r2">
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

export default UserDetailCampaignPage