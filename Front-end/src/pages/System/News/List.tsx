import { selectGetAllNews } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { NewsCard } from "@/components/Card";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getAllNewsApiThunk } from "@/services/news/newsThunk";
import { useEffect, useState } from "react";

const ListNewsPage = () => {
    const [activeTab, setActiveTab] = useState<"noibat" | "theodoi">("noibat");

    const dispatch = useAppDispatch();
    const news = useAppSelector(selectGetAllNews)
    const sortedNews = [...news].reverse();

    const handleToDetail = (newsId: string) => {
        const url = routes.user.news.detail.replace(":id", newsId);
        return navigateHook(url)
    }

    useEffect(() => {
        document.title = "Trang chủ";
        dispatch(setLoading(true));
        dispatch(getAllNewsApiThunk())
            .unwrap()
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch]);

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
                        </div>
                        <div className="ln-main">
                            {sortedNews && sortedNews.map((item, index) => (
                                <NewsCard news={item} key={index} onClickDetail={() => handleToDetail(item.newId)} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ListNewsPage