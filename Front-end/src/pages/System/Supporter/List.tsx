import { SupporterCard } from "@/components/Card";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { useState } from "react";

const ListSupporterPage = () => {
    const [activeTab, setActiveTab] = useState<"tochuc" | "canhan">("tochuc");

    const handleToDetail = (campaignId: string) => {
        const url = routes.user.supporter.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <main id="list-supporter">
            <section id="ls-section">
                <div className="lss-container">
                    <h1>Giải pháp đã tiếp sức thiện nguyện cho</h1>
                    <div className="ls-search-container">
                        <input type="text" className="lssc-input" placeholder="Tìm kiếm theo tên hoặc số tài khoản ủng hộ" />
                        <button className="sc-btn">Tìm kiếm</button>
                    </div>
                    <div className="ls-tabs">
                        <div
                            className={`ls-tabs-item ${activeTab === "tochuc" ? "ls-tabs-item-actived" : ""}`}
                            onClick={() => setActiveTab("tochuc")}
                        >
                            Tổ chức
                        </div>
                        <div
                            className={`ls-tabs-item ${activeTab === "canhan" ? "ls-tabs-item-actived" : ""}`}
                            onClick={() => setActiveTab("canhan")}
                        >
                            Cá nhân
                        </div>
                    </div>
                    <div className="lssc-main">
                        {activeTab === "tochuc" && (
                            <>
                                <SupporterCard onClickDetail={() => handleToDetail("1")}/>
                                <SupporterCard />
                                <SupporterCard />
                                <SupporterCard />
                                <SupporterCard />
                                <SupporterCard />
                                <button className="view-more">Xem thêm</button>
                            </>
                        )}
                        {activeTab === "canhan" && (
                            <>
                                <SupporterCard />
                                <SupporterCard />
                                <SupporterCard />
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ListSupporterPage