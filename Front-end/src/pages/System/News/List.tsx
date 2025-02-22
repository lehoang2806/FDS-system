import { NewsCard } from "@/components/Card";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { useState } from "react";

const ListNewsPage = () => {
    const [activeTab, setActiveTab] = useState<"noibat" | "theodoi">("noibat");

    const handleToDetail = (campaignId: string) => {
            const url = routes.user.news.detail.replace(":id", campaignId);
            return navigateHook(url)
        }

    return (
        <main id="list-news">
            <section id="ln-section">
                <div className="lns-container">
                    <div className="lnscr1">
                        <div className="line"></div>
                        <h1>Sự kiện thiện nguyện</h1>
                        <div className="line"></div>
                    </div>
                    <div className="lnscr2">
                        <input type="text" className="ln-search-input" placeholder="Tìm kiếm tên sự kiện" />
                    </div>
                    <div className="lnscr3">
                        <div className="ln-tabs">
                            <div
                                className={`ln-tabs-item ${activeTab === "noibat" ? "ln-tabs-item-actived" : ""}`}
                                onClick={() => setActiveTab("noibat")}
                            >
                                Nổi bật
                            </div>
                            <div
                                className={`ln-tabs-item ${activeTab === "theodoi" ? "ln-tabs-item-actived" : ""}`}
                                onClick={() => setActiveTab("theodoi")}
                            >
                                Theo dõi
                            </div>
                        </div>
                        <div className="ln-main">
                            {activeTab === "noibat" ? (
                                <>
                                    <NewsCard onClickDetail={() => handleToDetail("1")}/>
                                    <NewsCard />
                                    <NewsCard />
                                    <NewsCard />
                                    <NewsCard />
                                    <NewsCard />
                                    <button className="view-more">Xem thêm</button>
                                </>
                            ) : (
                                <>
                                    <NewsCard />
                                    <NewsCard />
                                    <NewsCard />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ListNewsPage