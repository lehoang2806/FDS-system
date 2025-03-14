import { selectGetAllCampaign, selectGetAllDonorCertificate, selectGetAllRecipientCertificate, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { AvatarUser, NoResult } from "@/assets/images"
import { CreateCampaignModal, RecipientCertificateModal, SubmitCertificateModal } from "@/components/Modal";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { getAllDonorCertificateApiThunk, getAllRecipientCertificateApiThunk } from "@/services/user/userThunk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserPersonalPage = () => {
    const dispatch = useAppDispatch();

    const userLogin = useAppSelector(selectUserLogin);

    const donorCertificates = useAppSelector(selectGetAllDonorCertificate);

    const recipientCertificates = useAppSelector(selectGetAllRecipientCertificate);

    const campaigns = useAppSelector(selectGetAllCampaign)

    const currentCampaigns = campaigns.filter((campaign) => campaign.accountId === userLogin?.accountId);

    const currentDonorCertificates = donorCertificates.filter((donorCertificate) => donorCertificate.donorId === userLogin?.accountId);

    const currentRecipientCertificates = recipientCertificates.filter((recipientCertificate) => recipientCertificate.recipientId === userLogin?.accountId);

    const [isSubmitCertificateModalOpen, setIsSubmitCertificateModalOpen] = useState(false);
    const [isRecipientCertificateModalOpen, setIsRecipientCertificateModalOpen] = useState(false);
    const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

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

    useEffect(() => {
        setActiveTab(getActiveTabFromURL());
    }, [location.search]);

    useEffect(() => {
        dispatch(getAllDonorCertificateApiThunk())
        dispatch(getAllRecipientCertificateApiThunk())
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
            });
    }, []);

    const handleCreateCampaign = () => {
        if (userLogin?.isConfirm === false) {
            setIsSubmitCertificateModalOpen(true)
        }
        if (userLogin?.isConfirm === true) {
            setIsCreateCampaignModalOpen(true)
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
                    {userLogin?.roleId === 3 && (
                        <>
                            <div className="upps2cr2">
                                <div className="upp-tabs">
                                    <div
                                        className={`upp-tabs-item ${activeTab === "chiendich" ? "upp-tabs-item-actived" : ""}`}
                                        onClick={() => handleTabChange("chiendich")}
                                    >
                                        Chiến dịch
                                    </div>
                                    <div
                                        className={`upp-tabs-item ${activeTab === "chungchi" ? "upp-tabs-item-actived" : ""}`}
                                        onClick={() => handleTabChange("chungchi")}
                                    >
                                        Chứng chỉ
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
                                                            Address
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Receive Date
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Description
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Gift Quantity
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Gift Type
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
                                                            <td className='table-body-cell'>{campaign.nameCampaign}</td>
                                                            <td className='table-body-cell'>{campaign.address}</td>
                                                            <td className='table-body-cell'>{campaign.receiveDate}</td>
                                                            <td className='table-body-cell'>{campaign.description}</td>
                                                            <td className='table-body-cell'>{campaign.giftQuantity}</td>
                                                            <td className='table-body-cell'>{campaign.giftType}</td>
                                                            <td className='table-body-cell'>{campaign.status === "Pending" ? <span className='status-pending'>Pending</span> : campaign.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                                            <td className="table-body-cell">
                                                                <button className='view-btn'>View</button>
                                                                {campaign.status === "Rejected" && <button className='reject-btn'>View Reason</button>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ) : (
                                    <div className="upp-content">
                                        <button className="pr-btn" onClick={() => navigateHook(routes.user.submit_certificate)}>Nộp chứng chỉ</button>
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
                                                            CCCD
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Full Name
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Phone
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
                                                            <td className='table-body-cell'>{row.citizenId}</td>
                                                            <td className='table-body-cell'>{row.fullName}</td>
                                                            <td className='table-body-cell'>{row.phone}</td>
                                                            <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                                            <td className="table-body-cell">
                                                                <button className="view-btn">View</button>
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
                                        onClick={() => handleTabChange("chiendich")}
                                    >
                                        Chiến dịch đăng ký
                                    </div>
                                    <div
                                        className={`upp-tabs-item ${activeTab === "chungchi" ? "upp-tabs-item-actived" : ""}`}
                                        onClick={() => handleTabChange("chungchi")}
                                    >
                                        Chứng chỉ
                                    </div>
                                </div>
                            </div>
                            <div className="upps2cr3">
                                {activeTab === "chiendich" ? (
                                    <div className="upp-content">
                                        <button className="pr-btn" onClick={handleCreateCampaign}>Tạo chiến dịch</button>
                                        <figure>
                                            <img src={NoResult} alt="" />
                                        </figure>
                                        <h1>Chưa có dữ liệu</h1>
                                    </div>
                                ) : (
                                    <div className="upp-content">
                                        <button className="pr-btn" onClick={() => setIsRecipientCertificateModalOpen(true)}>Nộp chứng chỉ</button>
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
                                                            Full Name
                                                        </th>
                                                        <th className="table-head-cell">
                                                            Phone
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
                                                    {currentRecipientCertificates.map((row, index) => (
                                                        <tr key={index} className="table-body-row">
                                                            <td className='table-body-cell'>{row.citizenId}</td>
                                                            <td className='table-body-cell'>{row.fullName}</td>
                                                            <td className='table-body-cell'>{row.phone}</td>
                                                            <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                                            <td className="table-body-cell">
                                                                <button className="view-btn">View</button>
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