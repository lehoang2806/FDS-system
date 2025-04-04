import { selectGetAllCampaign, selectGetAllDonorCertificate, selectGetAllRecipientCertificate, selectGetAllRegisterReceivers, selectGetProfileUser, selectIsAuthenticated, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { AvatarUser, NoResult } from "@/assets/images"
import { Loading } from "@/components/Elements";
import { CreateCampaignModal, RecipientCertificateModal, SubmitCertificateModal } from "@/components/Modal";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { getAllRegisterReceiversApiThunk } from "@/services/registerReceive/registerReceiveThunk";
import { getAllDonorCertificateApiThunk, getAllRecipientCertificateApiThunk, getProfileApiThunk } from "@/services/user/userThunk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserPersonalPage = () => {
    const dispatch = useAppDispatch();

    // Lấy dữ liệu từ Redux store
    const profileUser = useAppSelector(selectGetProfileUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userLogin = useAppSelector(selectUserLogin);
    const campaigns = useAppSelector(selectGetAllCampaign);
    const donorCertificates = useAppSelector(selectGetAllDonorCertificate);
    const recipientCertificates = useAppSelector(selectGetAllRecipientCertificate);
    const registerReceivers = useAppSelector(selectGetAllRegisterReceivers);

    // Lọc dữ liệu theo tài khoản đăng nhập
    const currentCampaigns = campaigns.filter(
        (campaign) => campaign.accountId === userLogin?.accountId
    );

    const currentDonorCertificates = donorCertificates.filter(
        (donorCertificate) => donorCertificate.donorId === userLogin?.accountId
    );

    const currentRecipientCertificates = recipientCertificates.filter(
        (recipientCertificate) => recipientCertificate.recipientId === userLogin?.accountId
    );

    const currentRegisterReceivers = registerReceivers.filter(
        (registerReceiver) => registerReceiver.accountId === userLogin?.accountId
    );

    // State quản lý modal
    const [isSubmitCertificateModalOpen, setIsSubmitCertificateModalOpen] = useState(false);
    const [isRecipientCertificateModalOpen, setIsRecipientCertificateModalOpen] = useState(false);
    const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);

    // Hooks điều hướng
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');

        if (!tab) {
            navigate(`?tab=chiendich`, { replace: true });
            return "chiendich";
        }

        return tab;
    };

    const [activeTab, setActiveTab] = useState<string>(getActiveTabFromURL());

    const handleTabChange = (tabIndex: string) => {
        setActiveTab(tabIndex);
        navigate(`?tab=${tabIndex}`);
    };

    const handleFilter = () => {
        setIsFiltering(true);
        setTimeout(() => {
            setIsFiltering(false);
        }, 1000);
    };

    useEffect(() => {
        setActiveTab(getActiveTabFromURL());
    }, [location.search]);

    useEffect(() => {
        document.title = "Trang cá nhân";
        dispatch(setLoading(true));
        dispatch(getAllRegisterReceiversApiThunk())
        dispatch(getAllDonorCertificateApiThunk())
        dispatch(getAllRecipientCertificateApiThunk())
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch]);

    const handleCreateCampaign = () => {
        if (profileUser?.isConfirm === false) {
            setIsSubmitCertificateModalOpen(true)
        }
        if (profileUser?.isConfirm === true) {
            setIsCreateCampaignModalOpen(true)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProfileApiThunk(String(userLogin?.accountId)))
                .unwrap();
        }
    }, [isAuthenticated]);

    const handleToDetailCampaign = (campaignId: string) => {
        const url = routes.user.detail_campaign.replace(":id", campaignId);
        return navigateHook(url)
    }

    const handleToDetailCertificate = (certificateId: string, type: string) => {
        const url = routes.user.detail_certificate.replace(":id", certificateId);
        if (type === "Personal") {
            return navigateHook(`${url}?type=Personal`);
        }
        if (type === "Organization") {
            return navigateHook(`${url}?type=Organization`);
        }
        if (type === "Recipient") {
            return navigateHook(`${url}?type=Recipient`);
        }
    }

    return (
        <main id="user-personal-page">
            <section id="upp-s1"></section>
            <section id="upp-s2">
                <div className="upps2-container">
                    <div className="upps2cr1">
                        <div className="upps2cr1c1">
                            <div className="upps2cr1c1c1">
                                <img src={AvatarUser} alt="" className="upp-avatar" />
                            </div>
                            <div className="upps2cr1c1c2">
                                <h2>{userLogin?.fullName}</h2>
                                <p>{userLogin?.email}</p>
                            </div>
                        </div>
                        <div className="upps2cr1c2">
                            <button className="pr-btn" onClick={() => navigateHook(routes.user.profile)}>Chỉnh sửa thông tin</button>
                        </div>
                    </div>
                    {isFiltering && <Loading loading={true} isFullPage />}
                    {userLogin?.roleId === 3 && (
                        <>
                            <div className="upps2cr2">
                                <div className="upp-tabs">
                                    <div
                                        className={`upp-tabs-item ${activeTab === "chiendich" ? "upp-tabs-item-actived" : ""}`}
                                        onClick={() => { handleTabChange("chiendich"), handleFilter() }}
                                    >
                                        Chiến dịch
                                    </div>
                                    <div
                                        className={`upp-tabs-item ${activeTab === "chungchi" ? "upp-tabs-item-actived" : ""}`}
                                        onClick={() => { handleTabChange("chungchi"), handleFilter() }}
                                    >
                                        Xác nhận danh tính
                                    </div>
                                </div>
                            </div>
                            <div className="upps2cr3">
                                {activeTab === "chiendich" ? (
                                    <div className="upp-content">
                                        <button className="pr-btn" onClick={handleCreateCampaign}>Tạo chiến dịch</button>
                                        {currentCampaigns.length === 0 ? (
                                            <>
                                                <figure>
                                                    <img src={NoResult} alt="" />
                                                </figure>
                                                <h1>Chưa có dữ liệu</h1>
                                            </>
                                        ) : (
                                            <table className="table">
                                                <thead className="table-head">
                                                    <tr className="table-head-row">
                                                        <th className="table-head-cell">
                                                            Campaign Name
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Description
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Status
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-body">
                                                    {currentCampaigns.map((campaign, index) => (
                                                        <tr className="table-body-row" key={index}>
                                                            <td className='table-body-cell'>{campaign.campaignName}</td>
                                                            <td className='table-body-cell'>{campaign.campaignDescription}</td>
                                                            <td className='table-body-cell'>{campaign.status === "Pending" ? <span className='status-pending'>Pending</span> : campaign.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                                            <td className="table-body-cell">
                                                                <button className='view-btn' onClick={() => handleToDetailCampaign(campaign.campaignId)}>View Detail</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ) : (
                                    <div className="upp-content">
                                        <button className="pr-btn" onClick={() => navigateHook(routes.user.submit_certificate)}>Xác nhận</button>
                                        {currentDonorCertificates.length === 0 ? (
                                            <>
                                                <figure>
                                                    <img src={NoResult} alt="" />
                                                </figure>
                                                <h1>Chưa có dữ liệu</h1>
                                            </>
                                        ) : (
                                            <table className="table">
                                                <thead className="table-head">
                                                    <tr className="table-head-row">
                                                        <th className="table-head-cell">
                                                            Type
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Status
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-body">
                                                    {currentDonorCertificates.map((row, index) => (
                                                        <tr key={index} className="table-body-row">
                                                            <td className='table-body-cell'>{row.citizenId === null ? "Organization" : "Personal"}</td>
                                                            <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                                            <td className="table-body-cell">
                                                                <button className="view-btn" onClick={() => row.citizenId === null ? handleToDetailCertificate(row.donorCertificateId, "Organization") : handleToDetailCertificate(row.donorCertificateId, "Personal")}>View Detail</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {userLogin?.roleId === 4 && (
                        <>
                            <div className="upps2cr2">
                                <div className="upp-tabs">
                                    <div
                                        className={`upp-tabs-item ${activeTab === "chiendich" ? "upp-tabs-item-actived" : ""}`}
                                        onClick={() => { handleTabChange("chiendich"), handleFilter() }}
                                    >
                                        Chiến dịch đăng ký
                                    </div>
                                    <div
                                        className={`upp-tabs-item ${activeTab === "chungchi" ? "upp-tabs-item-actived" : ""}`}
                                        onClick={() => { handleTabChange("chungchi"), handleFilter() }}
                                    >
                                        Xác nhận danh tính
                                    </div>
                                </div>
                            </div>
                            <div className="upps2cr3">
                                {activeTab === "chiendich" ? (
                                    <div className="upp-content">
                                        {currentRegisterReceivers.length === 0 ? (
                                            <>
                                                <figure>
                                                    <img src={NoResult} alt="" />
                                                </figure>
                                                <h1>Chưa có dữ liệu</h1>
                                            </>
                                        ) : (
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
                                                        <th className="table-head-cell">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-body">
                                                    {currentRegisterReceivers.map((registerReceiver, index) => (
                                                        <tr className="table-body-row" key={index}>
                                                            <td className='table-body-cell'>{registerReceiver.registerReceiverName}</td>
                                                            <td className='table-body-cell'>{registerReceiver.quantity}</td>
                                                            <td className='table-body-cell'>{registerReceiver.creatAt}</td>
                                                            <td className='table-body-cell'>
                                                                <button className="view-btn" onClick={() => handleToDetailCampaign(registerReceiver.campaignId)}>Go to Campaign</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ) : (
                                    <div className="upp-content">
                                        <button className="pr-btn" onClick={() => setIsRecipientCertificateModalOpen(true)}>Xác nhận</button>
                                        {currentRecipientCertificates.length === 0 ? (
                                            <>
                                                <figure>
                                                    <img src={NoResult} alt="" />
                                                </figure>
                                                <h1>Chưa có dữ liệu</h1>
                                            </>
                                        ) : (
                                            <table className="table">
                                                <thead className="table-head">
                                                    <tr className="table-head-row">
                                                        <th className="table-head-cell">
                                                            CCCD
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Họ và tên
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Số điện thoại
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Lí do đăng ký hỗ trợ
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
                                                    {currentRecipientCertificates.map((row, index) => (
                                                        <tr key={index} className="table-body-row">
                                                            <td className='table-body-cell'>{row.citizenId}</td>
                                                            <td className='table-body-cell'>{row.fullName}</td>
                                                            <td className='table-body-cell'>{row.phone}</td>
                                                            <td className='table-body-cell'>{row.registerSupportReason}</td>
                                                            <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                                            <td className="table-body-cell">
                                                                <button className="view-btn" onClick={() => handleToDetailCertificate(row.recipientCertificateId, "Recipient")}>View Detail</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
            <SubmitCertificateModal isOpen={isSubmitCertificateModalOpen} setIsOpen={setIsSubmitCertificateModalOpen} />
            <CreateCampaignModal isOpen={isCreateCampaignModalOpen} setIsOpen={setIsCreateCampaignModalOpen} />
            <RecipientCertificateModal isOpen={isRecipientCertificateModalOpen} setIsOpen={setIsRecipientCertificateModalOpen} />
        </main>
    )
}

export default UserPersonalPage