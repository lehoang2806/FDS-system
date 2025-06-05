import {
    selectGetAllCampaignRequestSupport,
    selectGetRequestSupportById,
} from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getAllCampaignRequestSupportApiThunk } from "@/services/campaignRequestSupport/campaignRequestSupportThunk";
import { getRequestSupportByIdApiThunk } from "@/services/requestSupport/requestSupportThunk";
import { formatDater, formatTime } from "@/utils/helper";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailRequestSupport = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
    const currentRequestSupport = useAppSelector(selectGetRequestSupportById);
    const campaignsRequestSupport = useAppSelector(
        selectGetAllCampaignRequestSupport
    );
    const currentCampaignsRequestSupport = campaignsRequestSupport.filter(
        (item) => item.requestSupportId === String(id)
    );

    useEffect(() => {
        dispatch(setLoading(true));
        Promise.all([
            dispatch(getRequestSupportByIdApiThunk(String(id))).unwrap(),
            dispatch(getAllCampaignRequestSupportApiThunk()).unwrap(),
        ])
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch, id]);

    const handleToDetailCampaignRequestSupport = (
        campaignRequestSupportId: string
    ) => {
        const url =
            routes.user.detail_campaign_request_support_for_recipient.replace(
                ":id",
                campaignRequestSupportId
            );
        return navigateHook(url);
    };

    return (
        <section id="detail-request-support">
            <div className="drs-container">
                <h1>Chi tiết đơn yêu cầu hỗ trợ</h1>
                <div className="drsr2">
                    <div className="col-flex drsr2c1">
                        <h2>Thông tin định danh</h2>
                        <h3>Họ và tên:</h3>
                        <p>{currentRequestSupport?.fullName}</p>
                        <h3>Ngày sinh:</h3>
                        <p>
                            {formatDater(
                                String(currentRequestSupport?.dateOfBirth)
                            )}
                        </p>{" "}
                        {/* Định dạng ngày sinh */}
                        <h3>Ảnh CMND:</h3>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            {currentRequestSupport?.citizenIdImages?.map(
                                (image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Citizen ID ${index}`}
                                        style={{
                                            width: "300px",
                                            height: "300px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )
                            )}
                        </div>
                        <h2>Thông tin liên hệ</h2>
                        <h3>Email:</h3>
                        <p>{currentRequestSupport?.email}</p>
                        <h3>Số điện thoại:</h3>
                        <p>{currentRequestSupport?.phoneNumber}</p>
                        <h3>Địa chỉ:</h3>
                        <p>{currentRequestSupport?.address}</p>
                    </div>
                    <div className="col-flex drsr2c2">
                        <div className="drsr2c2r1">
                            <h3>Thực phẩm yêu cầu:</h3>
                            {currentRequestSupport?.requestedItems?.map(
                                (product, index) => (
                                    <p key={index}>{product}</p>
                                )
                            )}
                            <h2>Hoàn cảnh và lý do hỗ trợ</h2>
                            <h3>Lý do cần hỗ trợ:</h3>
                            <p style={{ whiteSpace: "pre-line" }}>
                                {currentRequestSupport?.reason}
                            </p>
                            <h3>Số người trong hộ gia đình:</h3>
                            <p>{currentRequestSupport?.householdSize}</p>
                            <h3>Hình ảnh hoàn cảnh gia đình:</h3>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                }}
                            >
                                {currentRequestSupport?.circumstanceImages?.map(
                                    (image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Circumstance ${index}`}
                                            style={{
                                                width: "300px",
                                                height: "300px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                        <div className="drsr2c2r2">
                            <h2>Danh sách chiến dịch đồng ý hỗ trợ</h2>
                            <table className="table">
                                <thead className="table-head">
                                    <tr className="table-head-row">
                                        <th className="table-head-cell">
                                            Tên chiến dịch
                                        </th>
                                        <th className="table-head-cell">
                                            Thời gian diễn ra
                                        </th>
                                        <th className="table-head-cell">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {currentCampaignsRequestSupport.map(
                                        (campaign, index) => (
                                            <tr
                                                className="table-body-row"
                                                key={index}
                                            >
                                                <td className="table-body-cell">
                                                    {
                                                        campaign.campaignRequestSupportName
                                                    }
                                                </td>
                                                <td className="table-body-cell">
                                                    {formatDater(
                                                        String(
                                                            campaign.implementationTime
                                                        )
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                        String(
                                                            campaign.implementationTime
                                                        )
                                                    )}
                                                </td>
                                                <td className="table-body-cell">
                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            handleToDetailCampaignRequestSupport(
                                                                String(
                                                                    campaign.campaignRequestSupportId
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailRequestSupport;
