import { selectCurrentCampaign, selectGetAllRegisterReceivers } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { Subscriber } from '@/components/Elements/index'
import { RegisterReceiverModal, RemindCertificateModal, UpdateCampaignModal } from '@/components/Modal';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { setLoading } from '@/services/app/appSlice';
import { getCampaignByIdApiThunk } from '@/services/campaign/campaignThunk';
import { getAllRegisterReceiversApiThunk } from '@/services/registerReceive/registerReceiveThunk';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const UserDetailCampaignPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"mota" | "dangky">("mota");

    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const currentCampaign = useAppSelector(selectCurrentCampaign);

    const [isRemindCertificateModalOpend, setIsRemindCertificateModalOpend] = useState(false);

    const [isRegisterReceiverModalOpend, setIsRegisterReceiverModalOpend] = useState(false);

    const [isUpdateCampaignModalOpend, setIsUpdateCampaignModalOpend] = useState(false);

    const registerReceivers = useAppSelector(selectGetAllRegisterReceivers);

    const currentRegisterReceivers = registerReceivers.filter((registerReceiver) => registerReceiver.campaignId === id);

    const [selectedImage, setSelectedImage] = useState(currentCampaign?.images?.[0] || "")

    // Formatted date/time
    const formattedDate = currentCampaign?.implementationTime
        ? (() => {
            const [year, month, day] = currentCampaign.implementationTime.split("T")[0].split("-");
            return `${day}-${month}-${year}`;
        })()
        : "";

    const formattedTime = currentCampaign?.implementationTime
        ?.split("T")[1]
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

    return (
        <main id="user-detail-campaign">
            <section id="udc-section">
                <div className="udcs-container">
                    <div className="udcscr1">
                        <div className="udcscr1c1">
                            {selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt="Selected Campaign Image"
                                    style={{
                                        width: "600px",
                                        height: "600px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        marginBottom: "10px"
                                    }}
                                />
                            )}
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
                            <div className="udcscr1c1r1">
                                <h1>{currentCampaign?.campaignName} -
                                    <span>
                                        {currentCampaign?.status === "Pending" ? (
                                            <span className='status-pending'>Đang chờ phê duyệt</span>
                                        ) : currentCampaign?.status === "Approved" ? (
                                            <span className='status-approve'>Đã được phê duyệt</span>
                                        ) : currentCampaign?.status === "Rejected" ? (
                                            <span className='status-reject'>Đã bị từ chối</span>
                                        ) : currentCampaign?.status === "Canceled" ? (
                                            <span className='status-reject'>Đã huỷ</span>
                                        ) : null}
                                    </span>
                                </h1>
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
                                <div className="udcscr1c1r4-content" style={{ whiteSpace: "pre-line" }}>{currentCampaign?.campaignDescription}</div>
                            </div>
                        </div>
                        <div className="udcscr1c2">
                            <button className='pr-btn' onClick={() => setIsUpdateCampaignModalOpend(true)}>Cập nhật</button>
                            <button className='sc-btn' onClick={() => navigateHook(routes.user.campaign.detail.replace(":id", String(id)))}>Đi đến bài đăng</button>
                            <div className="udcscr1c2r1">
                                <div>
                                    <div>
                                        <h4>Địa điểm</h4>
                                        <p>{currentCampaign?.location}, {currentCampaign?.district}</p>
                                        <h4>Thời gian</h4>
                                        <p>{formattedDate} - {formattedTime}</p>
                                    </div>
                                </div>
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
                </div>
            </section>
            <RemindCertificateModal isOpen={isRemindCertificateModalOpend} setIsOpen={setIsRemindCertificateModalOpend} />
            <RegisterReceiverModal isOpen={isRegisterReceiverModalOpend} setIsOpen={setIsRegisterReceiverModalOpend} campaign={currentCampaign} />
            <UpdateCampaignModal isOpen={isUpdateCampaignModalOpend} setIsOpen={setIsUpdateCampaignModalOpend} selectedCampaign={currentCampaign} />
        </main>
    )
}

export default UserDetailCampaignPage