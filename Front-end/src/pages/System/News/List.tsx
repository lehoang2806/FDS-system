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

    const [visibleNewsCount, setVisibleNewsCount] = useState(6);

    const handleShowMoreNews = () => {
        setVisibleNewsCount((prev) => prev + 6);
    };

    const handleToDetail = (newsId: string) => {
        const url = routes.user.news.detail.replace(":id", newsId);
        return navigateHook(url)
    }

    //Search
    const [searchTerm, setSearchTerm] = useState("");

    const filteredNews = sortedNews.filter((item) =>
        item.newsTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const visibleFilteredNews = filteredNews.slice(0, visibleNewsCount);    

    useEffect(() => {
        document.title = "Trang chủ";
        dispatch(setLoading(true));
        dispatch(getAllNewsApiThunk())
            .unwrap()
            .catch((_) => {
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
                        <h1>Tin tức thiện nguyện</h1>
                        <div className="line"></div>
                    </div>
                    <div className="lnscr2">
                        <input
                            type="text"
                            className="ln-search-input"
                            placeholder="Tìm kiếm tên tên tin tức"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                            {sortedNews && visibleFilteredNews.map((item, index) => (
                                <NewsCard news={item} key={index} onClickDetail={() => handleToDetail(item.newId)} />
                            ))}
                            {visibleNewsCount < sortedNews.length && (
                                <div className="view-more-container">
                                    <button className="view-more" onClick={handleShowMoreNews}>Xem thêm</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ListNewsPage