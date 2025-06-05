import { selectGetCampaignRequestSupportById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { UpdateCampaignRequestSupportModal } from "@/components/Modal";
import { setLoading } from "@/services/app/appSlice";
import { getCampaignRequestSupportByIdApiThunk } from "@/services/campaignRequestSupport/campaignRequestSupportThunk";
import { formatDater, formatTime } from "@/utils/helper";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserDetailCampaignRequestSupportPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const currentCampaignRequestSupport = useAppSelector(
        selectGetCampaignRequestSupportById
    );

    const [
        isUpdateCampaignRequestSupportModalOpen,
        setIsUpdateCampaignRequestSupportModalOpend,
    ] = useState(false);

    const [selectedImage, setSelectedImage] = useState(
        currentCampaignRequestSupport?.images?.[0] || ""
    );

    useEffect(() => {
        if (id) {
            dispatch(setLoading(true));
            dispatch(getCampaignRequestSupportByIdApiThunk(id))
                .unwrap()
                .catch(() => {})
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000);
                });
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (
            currentCampaignRequestSupport?.images &&
            currentCampaignRequestSupport.images.length > 0
        ) {
            setSelectedImage(currentCampaignRequestSupport.images[0]);
        }
    }, [JSON.stringify(currentCampaignRequestSupport?.images)]);

    return (
        <main
            id="user-detail-campaign"
            style={{ minHeight: "calc(100vh - 650px)" }}
        >
            <section id="udc-section">
                <div className="udcs-container">
                    <div className="udcscr1">
                        <div className="udcscr1c1">
                            <div className="udcscr1c1r4">
                                {selectedImage && (
                                    <img
                                        src={selectedImage}
                                        alt="Selected Campaign Image"
                                        style={{
                                            width: "770px",
                                            height: "550px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            marginBottom: "10px",
                                        }}
                                    />
                                )}
                            </div>
                            <div className="udcscr1c1r4">
                                {currentCampaignRequestSupport?.images?.map(
                                    (img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Campaign Image ${index + 1}`}
                                            onClick={() =>
                                                setSelectedImage(img)
                                            }
                                            style={{
                                                width: "178px",
                                                height: "178px",
                                                margin: "5px",
                                                objectFit: "cover",
                                                cursor: "pointer",
                                                borderRadius: "5px",
                                                border:
                                                    selectedImage === img
                                                        ? "3px solid blue"
                                                        : "2px solid gray",
                                                transition: "0.3s",
                                            }}
                                        />
                                    )
                                )}
                            </div>
                            <div className="udcscr1c1r1">
                                <h1>
                                    {
                                        currentCampaignRequestSupport?.campaignRequestSupportName
                                    }
                                </h1>
                                {currentCampaignRequestSupport?.status ===
                                "Pending" ? (
                                    <p className="status-pending">
                                        Đang chờ phê duyệt
                                    </p>
                                ) : currentCampaignRequestSupport?.status ===
                                  "Approved" ? (
                                    <p className="status-approve">
                                        Đã được phê duyệt
                                    </p>
                                ) : currentCampaignRequestSupport?.status ===
                                  "Rejected" ? (
                                    <p className="status-reject">
                                        Đã bị từ chối
                                    </p>
                                ) : currentCampaignRequestSupport?.status ===
                                  "Canceled" ? (
                                    <p className="status-reject">Đã huỷ</p>
                                ) : null}
                            </div>
                        </div>
                        <div className="udcscr1c2">
                            {currentCampaignRequestSupport?.status ===
                                "Pending" && (
                                <button
                                    className="pr-btn"
                                    onClick={() =>
                                        setIsUpdateCampaignRequestSupportModalOpend(true)
                                    }
                                >
                                    Cập nhật
                                </button>
                            )}
                            <div className="udcscr1c2r1">
                                <div>
                                    <h4>Số lượng phần quà</h4>
                                    <p>
                                        {
                                            currentCampaignRequestSupport?.limitedQuantity
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h4>Địa điểm phát quà</h4>
                                    <p>
                                        {
                                            currentCampaignRequestSupport?.location
                                        }
                                        ,{" "}
                                    </p>
                                    <h4>Thời gian diễn ra</h4>
                                    <p>
                                        {formatDater(
                                            String(
                                                currentCampaignRequestSupport?.implementationTime
                                            )
                                        )}{" "}
                                        -{" "}
                                        {formatTime(
                                            String(
                                                currentCampaignRequestSupport?.implementationTime
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                            {currentCampaignRequestSupport?.status ===
                                "Pending" &&
                                currentCampaignRequestSupport.reviewComments
                                    ?.length > 0 && (
                                    <>
                                        <div className="sdcucr2r5">
                                            <h3>
                                                Cần bổ sung các thông tin sau:
                                            </h3>
                                            {currentCampaignRequestSupport.reviewComments?.map(
                                                (comment, index) => (
                                                    <p
                                                        key={index}
                                                        style={{
                                                            whiteSpace:
                                                                "pre-line",
                                                        }}
                                                    >
                                                        {comment.content}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
                            {currentCampaignRequestSupport?.status ===
                                "Rejected" && (
                                <>
                                    <h3>Lí do bị từ chối</h3>
                                    <p>
                                        {
                                            currentCampaignRequestSupport.rejectComment
                                        }
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <UpdateCampaignRequestSupportModal
                isOpen={isUpdateCampaignRequestSupportModalOpen}
                setIsOpen={setIsUpdateCampaignRequestSupportModalOpend}
                selectedCampaignRequestSupport={currentCampaignRequestSupport}
            />
        </main>
    );
};

export default UserDetailCampaignRequestSupportPage;
