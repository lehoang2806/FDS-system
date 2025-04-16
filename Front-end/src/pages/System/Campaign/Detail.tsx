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
    const sortedCampaigns = [...campaigns].reverse();

    const approvedCampaigns = sortedCampaigns.filter((campaign) => campaign.status === "Approved");

    const otherCampaigns = approvedCampaigns.filter((campaign) => campaign.campaignId !== id).slice(0, 3) as Array<CampaignInfo>;

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

    // Formated Date
    const formattedDate = currentCampaign?.implementationTime
        ? (() => {
            const dateStr = currentCampaign.implementationTime.split("T")[0];
            const [year, month, day] = dateStr.split("-");
            return `${day}-${month}-${year}`;
        })()
        : "";

    // Formated Time
    const formattedTime = currentCampaign?.implementationTime
        .split("T")[1]
        .replace("Z", "")
        .split(":")
        .slice(0, 2)
        .join(":");

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

    const currentDate = new Date();

    const totalRegisteredQuantity = currentRegisterReceivers.reduce((sum, receiver) => sum + (receiver.quantity || 0), 0);

    return (
        <main id="detail-campaign">
            <section id="dc-section">
                <div className="dcs-container">
                    <div className="dcscr1">
                        <div className="dcscr1c1">
                            <div className="dcscr1c1r1">
                                <h1>{currentCampaign?.campaignName}</h1>
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
                                <div className="dcscr1c1r4-content">{currentCampaign?.campaignDescription}</div>
                            </div>
                            <div className="dcscr1c1r4">
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
                            <div className="dcscr1c1r4">
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
                        <div className="dcscr1c2">
                            <div className="dcscr1c2r1">
                                <div>
                                    <h4>Phần quà</h4>
                                    <p>{currentCampaign?.typeGift}</p>
                                </div>
                                <div>
                                    <h4>Địa điểm</h4>
                                    <p>{currentCampaign?.location}</p>
                                    <h4>Thời gian</h4>
                                    <p>{formattedDate} - {formattedTime}</p>
                                </div>
                                {userLogin?.roleId === 4 && currentCampaign && (
                                    <>
                                        {/* Campaign dạng Limited */}
                                        {currentCampaign.campaignType === "Limited" &&
                                            currentCampaign.implementationTime &&
                                            currentCampaign.implementationTime > currentDate.toISOString() && (
                                                totalRegisteredQuantity >= (Number(currentCampaign.limitedQuantity) || 0) ? (
                                                    <p className="sc-text">Đã đăng ký đủ số lượng</p>
                                                ) : (
                                                    <button className='sc-btn' onClick={handleRegisterReceiver}>
                                                        Đăng ký nhận hỗ trợ
                                                    </button>
                                                )
                                            )}

                                        {/* Campaign dạng Voluntary */}
                                        {currentCampaign.campaignType === "Voluntary" &&
                                            currentCampaign.implementationTime &&
                                            currentDate.toISOString() <= currentCampaign.implementationTime && (
                                                currentCampaign.startRegisterDate &&
                                                currentCampaign.endRegisterDate && (
                                                    currentDate.toISOString() < currentCampaign.startRegisterDate ? (
                                                        <p className="sc-text">Chưa mở đăng ký</p>
                                                    ) : currentDate.toISOString() > currentCampaign.endRegisterDate ? (
                                                        <p className="sc-text">Đã đóng đăng ký nhận quà</p>
                                                    ) : (
                                                        <button className='sc-btn' onClick={handleRegisterReceiver}>
                                                            Đăng ký nhận quà
                                                        </button>
                                                    )
                                                )
                                            )}
                                    </>
                                )}

                            </div>
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
                        </div>
                    </div>
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
                </div>
            </section>
            <RemindCertificateModal isOpen={isRemindCertificateModalOpend} setIsOpen={setIsRemindCertificateModalOpend} />
            <RegisterReceiverModal isOpen={isRegisterReceiverModalOpend} setIsOpen={setIsRegisterReceiverModalOpend} campaign={currentCampaign} />
        </main>
    )
}

export default DetailCampaignPage