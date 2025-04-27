import { selectGetAllPosts, selectGetProfileUser, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { ApprovedPost } from "@/components/Elements"
import { setLoading } from "@/services/app/appSlice";
import { getAllPostsApiThunk } from "@/services/post/postThunk";
import { getProfileApiThunk } from "@/services/user/userThunk";
import { FC, useEffect, useState } from "react"

const StaffListPostPage: FC = () => {
    const [activeTab, setActiveTab] = useState<"all" | "staff" | "pending">("all");

    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectGetAllPosts)
    const sortedPosts = [...posts].reverse();

    const approvedPosts = sortedPosts.filter((post) => post.status === "Approved");

    const userLogin = useAppSelector(selectUserLogin);
    const userProfile = useAppSelector(selectGetProfileUser);

    useEffect(() => {
        dispatch(setLoading(true));
        Promise.all([
            dispatch(getAllPostsApiThunk()).unwrap(),
            dispatch(getProfileApiThunk(String(userLogin?.accountId))).unwrap()
        ])
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);


    return (
        <section id="staff-list-post" className="staff-section">
            <div className="staff-container slp-container">
                <div className="slpcr1">
                    <h1>Bài viết</h1>
                    <p>Trang tổng quan<span className="staff-tag">Bài viết</span></p>
                </div>
                <div className="slpcr2">
                    <div className="slpcr2c1">
                        <div
                            className={`slp-tab ${activeTab === "all" ? "slp-tab-actived" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            Tất cả
                        </div>
                    </div>
                    <div className="slpcr2c2">
                        {activeTab === "all" && (
                            <>
                                {approvedPosts.map((post, index) => (
                                    <ApprovedPost key={index} post={post} userId={String(userProfile?.accountId)}/>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffListPostPage