import { AvatarUser, NoResult } from "@/assets/images"
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { useState } from "react";

const UserPersonalPage = () => {
    const [activeTab, setActiveTab] = useState<"chiendich" | "chungchi">("chiendich");

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
                                onClick={() => setActiveTab("chiendich")}
                            >
                                Chiến dịch
                            </div>
                            <div
                                className={`upp-tabs-item ${activeTab === "chungchi" ? "upp-tabs-item-actived" : ""}`}
                                onClick={() => setActiveTab("chungchi")}
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
                                <figure>
                                    <img src={NoResult} alt="" />
                                </figure>
                                <h1>Chưa có dữ liệu</h1>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default UserPersonalPage