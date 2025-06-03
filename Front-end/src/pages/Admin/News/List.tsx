import { selectGetAllNews } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { ArrowLeft, ArrowRight, TotalIcon } from "@/assets/icons";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getAllNewsApiThunk } from "@/services/news/newsThunk";
import { formatDater } from "@/utils/helper";
import { FC, useEffect, useState } from "react";

const AdminListNewsPage: FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleToDetail = (newsId: string) => {
        const url = routes.admin.news.detail.replace(":id", newsId);
        return navigateHook(url);
    };

    const dispatch = useAppDispatch();
    const news = useAppSelector(selectGetAllNews);
    const sortedNews = [...news].reverse();

    const filteredNews = sortedNews.filter((item) =>
        item.newsTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllNewsApiThunk())
            .unwrap()
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);

    const ITEMS_PER_PAGE = 5;

    const [currentNewsPage, setCurrentNewsPage] = useState(1);

    const totalNewsPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

    const currentNewsesPage = filteredNews.slice(
        (currentNewsPage - 1) * ITEMS_PER_PAGE,
        currentNewsPage * ITEMS_PER_PAGE
    );

    const onPreviousNewsPage = () => {
        if (currentNewsPage > 1) setCurrentNewsPage(currentNewsPage - 1);
    };

    const onNextNewsPage = () => {
        if (currentNewsPage < totalNewsPages)
            setCurrentNewsPage(currentNewsPage + 1);
    };

    return (
        <section id="admin-list-news" className="admin-section">
            <div className="admin-container aln-container">
                <div className="alncr1">
                    <h1>Tin tức</h1>
                    <p>
                        Trang tổng quát
                        <span className="admin-tag">Tin tức</span>
                    </p>
                </div>
                <div className="alncr2">
                    <div className="admin-tab admin-tab-1">
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Tất cả</h3>
                            <p>{news.length} Tin tức</p>
                        </div>
                    </div>
                </div>
                <div className="alncr4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tiêu đề tin tức"
                        className="pr-input"
                        value={searchTerm}
                        onChange={(e) => {
                            setCurrentNewsPage(1); // reset về trang 1 khi tìm
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
                <div className="alncr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Tiêu đề</th>
                                <th className="table-head-cell">
                                    Ngày đăng bài
                                </th>
                                <th className="table-head-cell">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {news &&
                                currentNewsesPage.map((item, index) => (
                                    <tr className="table-body-row" key={index}>
                                        <td className="table-body-cell">
                                            {item.newsTitle}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDater(item.createdDate)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    handleToDetail(item.newId)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="paginator">
                        <div className="p-container">
                            <div className="pcc2">
                                {currentNewsPage} of {totalNewsPages}
                            </div>
                            <div className="pcc3">
                                <button
                                    disabled={currentNewsPage === 1}
                                    onClick={onPreviousNewsPage}
                                >
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={currentNewsPage >= totalNewsPages}
                                    onClick={onNextNewsPage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${
                                            currentNewsPage >= totalNewsPages
                                                ? "pcc3-icon-disabled"
                                                : ""
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminListNewsPage;
