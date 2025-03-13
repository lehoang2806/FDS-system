import { selectGetAllDonorCertificate, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { AvatarUser, NoResult } from "@/assets/images"
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { getAllDonorCertificateApiThunk } from "@/services/user/userThunk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserPersonalPage = () => {
    const dispatch = useAppDispatch();

    const userLogin = useAppSelector(selectUserLogin);

    const donorCertificates = useAppSelector(selectGetAllDonorCertificate);

    const currentDonorCertificates = donorCertificates.filter((donorCertificate) => donorCertificate.donorId === userLogin?.accountId);

    console.log(currentDonorCertificates)

    const location = useLocation();
    const navigate = useNavigate();

    const getActiveTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return String(params.get('tab')) || '';
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
            .unwrap()
            .catch(() => {
            }).finally(() => {
            });
    }, []);

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
                                <h2>Name</h2>
                                <p>Email</p>
                            </div>
                        </div>
                        <div className="upps2cr1c2">
                            <button className="pr-btn" onClick={() => navigateHook(routes.user.profile)}>Chỉnh sửa thông tin</button>
                        </div>
                    </div>
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
                                <button className="pr-btn">Tạo chiến dịch</button>
                                <figure>
                                    <img src={NoResult} alt="" />
                                </figure>
                                <h1>Chưa có dữ liệu</h1>
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
                                                    <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approved'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                                    <td className="table-body-cell">
                                                        {/* <button className="view-btn" onClick={() => handleToDetail(row.id)}>View</button> */}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default UserPersonalPage