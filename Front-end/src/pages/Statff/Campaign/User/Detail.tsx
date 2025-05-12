import { selectCurrentCampaign, selectGetAllRegisterReceivers } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { AdditionalCampaignModal, RejectCampaignModal } from '@/components/Modal';
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice';
import { approveCampaignApiThunk, getCampaignByIdApiThunk } from '@/services/campaign/campaignThunk';
import { getAllRegisterReceiversApiThunk } from '@/services/registerReceive/registerReceiveThunk';
import { AdditionalCampaign, ApproveCampaign, RejectCampaign } from '@/types/campaign';
import { FC, useEffect, useState } from 'react'
import Lightbox from 'react-awesome-lightbox';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from "dayjs";
import { formatDater, formatTime } from '@/utils/helper';

const StaffDetailCampaignUserPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const currentCampaign = useAppSelector(selectCurrentCampaign);

    const registerReceivers = useAppSelector(selectGetAllRegisterReceivers);

    const currentRegisterReceivers = registerReceivers.filter((registerReceiver) => registerReceiver.campaignId === id);

    const [selectedRejectCampaign, setSelectedRejectCampaign] = useState<RejectCampaign | null>(null);

    const [selectedAdditionalCampaign, setSelectedAdditionalCampaign] = useState<AdditionalCampaign | null>(null);

    const [isRejectCampaignModalOpen, setIsRejectCampaignModalOpen] = useState(false);

    const [isAdditionalCampaignModalOpen, setIsAdditionalCampaignModalOpen] = useState(false);

    const date = dayjs(currentCampaign?.implementationTime).format("DD/MM/YYYY");
    const time = currentCampaign?.implementationTime.split("T")[1].replace("Z", "");
    const dateCreate = dayjs(currentCampaign?.createdDate).format("DD/MM/YYYY");

    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        if (currentCampaign?.images?.length) {
            setImagePreview(currentCampaign.images);
        } else {
            setImagePreview([]);
        }
    }, [currentCampaign]);

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

    const handleApproveCampaign = async (values: ApproveCampaign) => {
        try {
            dispatch(setLoading(true));
            await dispatch(approveCampaignApiThunk(values)).unwrap();
            toast.success("Phê duyệt thành công");
            dispatch(getCampaignByIdApiThunk(String(id)))
                .unwrap()
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                });
        } catch (error) {
            toast.error("An error occurred while approving the certificate.");
        }
    };


    const handleRejectCampaign = (campaignId: string) => {
        setSelectedRejectCampaign({ campaignId, comment: "" });
        setIsRejectCampaignModalOpen(true);
    };

    const handleAdditionalCampaign = (campaignId: string) => {
        setSelectedAdditionalCampaign({ campaignId, content: "" });
        setIsAdditionalCampaignModalOpen(true);
    };

    return (
        <section id="staff-detail-campaign-user" className="staff-section">
            <div className="staff-container sdcu-container">
                <div className="sdcucr1">
                    <h1>Người hiến tặng thực phẩm</h1>
                    <p>Trang tổng quát<span className="staff-tag">Chi tiết chiến dịch</span></p>
                </div>
                <div className="sdcucr2">
                    <div className="sdcucr2r1">
                        <h2></h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.campaign.user.list)}>Quay lại trang danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcucr2r2">
                        <div className="col-flex sdcucr2r2c1">
                            <h3>Trạng thái:</h3>
                            <p>
                                {currentCampaign?.status === "Pending" ? (
                                    <span>Đang chờ phê duyệt</span>
                                ) : currentCampaign?.status === "Approved" ? (
                                    <span>Đã được phê duyệt</span>
                                ) : currentCampaign?.status === "Rejected" ? (
                                    <span>Đã bị từ chối</span>
                                ) : currentCampaign?.status === "Canceled" ? (
                                    <span>Đã huỷ</span>
                                ) : (
                                    <span>Không xác định</span>
                                )}
                            </p>
                        </div>
                        <div className="col-flex sdcucr2r2c2">
                            <h3>Ngày được tạo:</h3>
                            <p>{dateCreate}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdcucr2r3">
                        <div className="col-flex sdcucr2r3c1">
                            <h2>Thông tin chiến dịch</h2>
                            <h3>Tên chiến dịch: <span>{currentCampaign?.campaignName}</span></h3>
                            <h3>Mô tả: <span style={{ whiteSpace: "pre-line" }}>{currentCampaign?.campaignDescription}</span></h3>
                            <h3>Địa điểm phát quà: <span>{currentCampaign?.location}, {currentCampaign?.district}</span></h3>
                            <h3>Thời gian diễn ra: <span>{date} & {time}</span></h3>
                            <h3>Cách thực hiện: <span>{currentCampaign?.implementationMethod}</span></h3>
                            <h3>Số lượng quà tặng: <span>{currentCampaign?.limitedQuantity}</span></h3>
                        </div>
                        <div className="col-flex sdcucr2r3c2">
                            {currentCampaign?.estimatedBudget || currentCampaign?.averageCostPerGift ? (
                                <>
                                    <h2>Thông tin tài chính</h2>
                                    {currentCampaign?.estimatedBudget && (
                                        <>
                                            <h3>Ngân sách ước tính: <span>{currentCampaign?.estimatedBudget}</span></h3>
                                        </>
                                    )}
                                    {currentCampaign?.averageCostPerGift && (
                                        <>
                                            <h3>Giá trung bình mỗi phần quà: <span>{currentCampaign?.averageCostPerGift}</span></h3>
                                        </>
                                    )}
                                </>
                            ) : null}
                            {currentCampaign?.sponsors || currentCampaign?.communication ? (
                                <>
                                    <h2>Thông tin truyền thông</h2>
                                    {currentCampaign?.sponsors && (
                                        <>
                                            <h3>Nhà tài trợ: <span>{currentCampaign?.sponsors}</span></h3>
                                        </>
                                    )}
                                    {currentCampaign?.communication && (
                                        <>
                                            <h3>Truyền thông: <span>{currentCampaign?.communication}</span></h3>
                                        </>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                    <div className="sdcucr2r4">
                        {imagePreview.length > 0 && (
                            <div className="image-preview-container">
                                {imagePreview.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Preview ${index}`}
                                        className="image-preview"
                                        style={{ width: "200px", height: "200px", cursor: "pointer" }}
                                        onClick={() => setLightboxIndex(index)} // Thêm dòng này để mở Lightbox
                                    />
                                ))}
                            </div>
                        )}

                        {lightboxIndex !== null && (
                            <Lightbox
                                images={imagePreview.map((src) => ({ url: src }))}
                                startIndex={lightboxIndex}
                                onClose={() => setLightboxIndex(null)}
                            />
                        )}
                    </div>
                    {currentCampaign?.status === "Pending" && (
                        <>
                            {currentCampaign.reviewComments && currentCampaign.reviewComments?.length > 0 && (
                                <div className="sdcucr2r5">
                                    <h3>Yêu cầu bổ sung thêm:</h3>
                                    {currentCampaign.reviewComments?.map((comment, index) => (
                                        <p key={index} style={{ whiteSpace: "pre-line" }}>{comment.content}</p>
                                    ))}
                                </div>
                            )}
                            <button className='approve-btn' onClick={() => handleApproveCampaign({ campaignId: String(id) })}>Phê duyệt</button>
                            <button className='reject-btn' onClick={() => handleRejectCampaign(String(id))}>Từ chối</button>
                            <button className='additional-btn' onClick={() => handleAdditionalCampaign(String(id))}>Yêu cầu bổ sung</button>
                        </>
                    )}
                    {currentCampaign?.status === "Rejected" && (
                        <>
                            <h3>Lý do từ chối:</h3>
                            <p>{currentCampaign?.rejectComment}</p>
                        </>
                    )}
                </div>
                <div className="sdcucr2">
                    <h2>Danh sách người đăng ký</h2>
                    {currentCampaign?.status === "Approved" && (
                        <div className="sdcucr2r3">
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">
                                            Tên người đại diện
                                        </th>
                                        <th className="table-head-cell">
                                            Số lượng đăng ký
                                        </th>
                                        <th className="table-head-cell">
                                            Thời gian đăng ký
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {currentRegisterReceivers.map((registerReceiver, index) => (
                                        <tr className="table-body-row" key={index}>
                                            <td className='table-body-cell'>{registerReceiver.registerReceiverName}</td>
                                            <td className='table-body-cell'>{registerReceiver.quantity}</td>
                                            <td className='table-body-cell'>{formatDater(registerReceiver.creatAt)} - {formatTime(registerReceiver.creatAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <RejectCampaignModal isOpen={isRejectCampaignModalOpen} setIsOpen={setIsRejectCampaignModalOpen} selectedCampaign={selectedRejectCampaign} />
            <AdditionalCampaignModal isOpen={isAdditionalCampaignModalOpen} setIsOpen={setIsAdditionalCampaignModalOpen} selectedCampaign={selectedAdditionalCampaign} />
        </section>
    )
}

export default StaffDetailCampaignUserPage