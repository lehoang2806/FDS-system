import { selectGetAllCampaign, selectGetProfileUser } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { setLoading } from "@/services/app/appSlice";
import { getProfileApiThunk } from "@/services/user/userThunk";
import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { format } from 'date-fns';
import { formatDater } from "@/utils/helper";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { ArrowLeft, ArrowRight } from "@/assets/icons";

const StaffDetailUserPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const userProfile = useAppSelector(selectGetProfileUser)

    const createdDate = userProfile?.createdDate && userProfile?.createdDate.split("T")[0];

    const campaigns = useAppSelector(selectGetAllCampaign);
    const sortedCampaigns = [...campaigns].reverse();
    const currentDonorCampaign = sortedCampaigns.filter((campaign) => campaign.accountId === id);

    useEffect(() => {
        if (id) {
            dispatch(setLoading(true))
            Promise.all([
                dispatch(getProfileApiThunk(id)).unwrap(),
                dispatch(getAllCampaignApiThunk()).unwrap(),
            ])
                .then(() => {
                })
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false))
                    }, 1000)
                })
        }
    }, [id])

    const ITEMS_PER_PAGE = 5;

    const [currentCampaignPage, setCurrentCampaignPage] = useState(1);

    const totalCampaignPages = Math.ceil(currentDonorCampaign.length / ITEMS_PER_PAGE);

    const currentCampaignsPage = currentDonorCampaign.slice(
        (currentCampaignPage - 1) * ITEMS_PER_PAGE,
        currentCampaignPage * ITEMS_PER_PAGE
    );

    const onPreviousCampaignPage = () => {
        if (currentCampaignPage > 1) setCurrentCampaignPage(currentCampaignPage - 1);
    };

    const onNextCampaignPage = () => {
        if (currentCampaignPage < totalCampaignPages) setCurrentCampaignPage(currentCampaignPage + 1);
    };

    const handleToDetail = (campaignId: string) => {
        const url = routes.staff.campaign.user.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <section id="staff-detail-user" className="staff-section">
            <div className="staff-container sdu-container">
                <div className="sducr1">
                    <h1>Người dùng</h1>
                    <p>Dashboard<span className="staff-tag">Chi tiết người dùng</span></p>
                </div>
                <div className="sducr2">
                    <div className="sducr2r1">
                        <h2></h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.user.list)}>Quay về danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sducr2r2">
                        <div className="sducr2r2c1">
                            <h3>Trạng thái tài khoản:</h3>
                            <p>{userProfile?.isConfirm ? "Đã được xác minh" : "Chưa được xác minh"}</p>
                        </div>
                        <div className="sducr2r2c2">
                            <h3>Ngày đăng ký:</h3>
                            <p>
                                {createdDate ? format(new Date(createdDate), 'dd/MM/yyyy') : ''}
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="sducr2r3">
                        <h3>Họ và têm: <span>{userProfile?.fullName}</span></h3>
                        <h3>Email: <span>{userProfile?.email}</span></h3>
                        <h3>Số điện thoại: <span>{userProfile?.phone}</span></h3>
                        {userProfile?.address && (
                            <>
                                <h3>Đại điểm: <span>{userProfile.address}</span></h3>
                            </>
                        )}
                        {userProfile?.birthDay && (
                            <>
                                <h3>Ngày sinh: <span>{formatDater(String(userProfile.birthDay))}</span></h3>
                            </>
                        )}
                        <h3>Vai trò: <span>{userProfile?.roleId === 3 ? "Người tặng thực phẩm" : "Người nhận thực phẩm"}</span></h3>
                    </div>
                </div>
                {currentDonorCampaign.length > 0 && (
                    <div className="sducr2">
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-head-row">
                                    <th className="table-head-cell">
                                        Tên chiến dịch
                                    </th>
                                    <th className="table-head-cell">
                                        Trạng thái
                                    </th>
                                    <th className="table-head-cell">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {currentCampaignsPage.map((campaign, index) => (
                                    <tr className="table-body-row" key={index}>
                                        <td className='table-body-cell'>{campaign.campaignName}</td>
                                        <td className='table-body-cell'>
                                            {campaign.status === "Pending" ? (
                                                <span className='status-pending'>Đang chờ phê duyệt</span>
                                            ) : campaign.status === "Approved" ? (
                                                <span className='status-approve'>Đã được phê duyệt</span>
                                            ) : campaign.status === "Rejected" ? (
                                                <span className='status-reject'>Đã bị từ chối</span>
                                            ) : campaign.status === "Canceled" ? (
                                                <span className='status-reject'>Đã huỷ</span>
                                            ) : null}
                                        </td>
                                        <td className="table-body-cell">
                                            <button className='view-btn' onClick={() => handleToDetail(campaign.campaignId)}>Xem chi tiết</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='paginator'>
                            <div className="p-container">
                                <div className="pcc2">{currentCampaignPage} of {totalCampaignPages}</div>
                                <div className="pcc3">
                                    <button disabled={currentCampaignPage === 1} onClick={onPreviousCampaignPage}>
                                        <ArrowLeft className="pcc3-icon" />
                                    </button>
                                    <button
                                        disabled={currentCampaignPage >= totalCampaignPages}
                                        onClick={onNextCampaignPage}
                                    >
                                        <ArrowRight
                                            className={`pcc3-icon ${currentCampaignPage >= totalCampaignPages ? 'pcc3-icon-disabled' : ''}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default StaffDetailUserPage