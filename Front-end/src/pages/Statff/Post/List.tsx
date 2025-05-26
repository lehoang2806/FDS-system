import { selectGetAllPosts } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { ArrowLeft, ArrowRight } from "@/assets/icons";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getAllPostsApiThunk } from "@/services/post/postThunk";
import { formatDater } from "@/utils/helper";
import { FC, useEffect, useState } from "react";

const StaffListPostPage: FC = () => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectGetAllPosts);
    const sortedPosts = [...posts].reverse();

    const approvedPosts = sortedPosts.filter(
        (post) => post.status === "Approved"
    );

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllPostsApiThunk())
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

    const [currentPostPage, setCurrentPostPage] = useState(1);

    const totalPostPages = Math.ceil(approvedPosts.length / ITEMS_PER_PAGE);

    const currentPostesPage = approvedPosts.slice(
        (currentPostPage - 1) * ITEMS_PER_PAGE,
        currentPostPage * ITEMS_PER_PAGE
    );

    const onPreviousPostPage = () => {
        if (currentPostPage > 1) setCurrentPostPage(currentPostPage - 1);
    };

    const onNextPostPage = () => {
        if (currentPostPage < totalPostPages)
            setCurrentPostPage(currentPostPage + 1);
    };

    const handleToDetail = (postId: string) => {
        const url = routes.staff.post.detail.replace(":id", postId);
        return navigateHook(url);
    };

    return (
        <section id="staff-list-post" className="staff-section">
            <div className="staff-container slp-container">
                <div className="slpcr1">
                    <h1>Bài viết</h1>
                    <p>
                        Trang tổng quan
                        <span className="staff-tag">Bài viết</span>
                    </p>
                </div>
                <div className="slpcr2">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Tên người đăng
                                </th>
                                <th className="table-head-cell">
                                    Ngày đăng bài
                                </th>
                                <th className="table-head-cell">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {approvedPosts &&
                                currentPostesPage.map((item, index) => (
                                    <tr className="table-body-row" key={index}>
                                        <td className="table-body-cell">
                                            {item.posterName}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDater(item.publicDate)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    handleToDetail(item.postId)
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
                                {currentPostPage} of {totalPostPages}
                            </div>
                            <div className="pcc3">
                                <button
                                    disabled={currentPostPage === 1}
                                    onClick={onPreviousPostPage}
                                >
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={currentPostPage >= totalPostPages}
                                    onClick={onNextPostPage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${
                                            currentPostPage >= totalPostPages
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

export default StaffListPostPage;
