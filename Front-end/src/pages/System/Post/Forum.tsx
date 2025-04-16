import { selectGetAllPosts, selectIsAuthenticated, selectUserLogin } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { Post } from '@/components/Elements';
import { CreatePostModal } from '@/components/Modal';
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice';
import { getAllPostsApiThunk } from '@/services/post/postThunk';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const PostForumPage = () => {
    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] = useState<"noibat" | "cuatoi">("noibat");

    const isAuthentication = useAppSelector(selectIsAuthenticated)
    const userLogin = useAppSelector(selectUserLogin)

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

    const posts = useAppSelector(selectGetAllPosts)
    const sortedPosts = [...posts].reverse();

    const personalPost = sortedPosts.filter(post => post.posterId === userLogin?.accountId)

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getAllPostsApiThunk())
            .unwrap()
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch])

    const handleCreatePostModalOpen = () => {
        if (isAuthentication) {
            setIsCreatePostModalOpen(true)
        } else {
            alert('Vui lòng đăng nhập')
        }
    }

    return (
        <main id="post-forum">
            <section id="pf-section">
                <div className="pfs-container">
                    <div className="pfscc1">
                        <div className="pfscc1r1">
                            <div className="pfscc1r1r1">
                                <h3>Chiến dịch mới nhất</h3>
                                <Link to={routes.user.campaign.list}>Tất cả</Link>
                            </div>
                            <div className="pfscc1r1r2">
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <h5 className="pf-card-name">Tên chiến dịch</h5>
                                        <p className='pf-card-time'>Còn lại 2 ngày</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <h5 className="pf-card-name">Tên chiến dịch</h5>
                                        <p className='pf-card-time'>Còn lại 2 ngày</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <h5 className="pf-card-name">Tên chiến dịch</h5>
                                        <p className='pf-card-time'>Còn lại 2 ngày</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pfscc1r2">
                            <div className="pfscc1r2r1">
                                <h3>Tin tức mới nhất</h3>
                                <Link to={routes.user.news.list}>Tất cả</Link>
                            </div>
                            <div className="pfscc1r2r2">
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <p className="pf-card-status">Trạng thái</p>
                                        <h5 className="pf-card-name">Tên tin tức</h5>
                                        <p className='pf-card-time'>Ngày đăng</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <p className="pf-card-status">Trạng thái</p>
                                        <h5 className="pf-card-name">Tên tin tức</h5>
                                        <p className='pf-card-time'>Ngày đăng</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <p className="pf-card-status">Trạng thái</p>
                                        <h5 className="pf-card-name">Tên tin tức</h5>
                                        <p className='pf-card-time'>Ngày đăng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pfscc2">
                        <div className="pfscc2r1">
                            <div className="pf-tabs">
                                <div
                                    className={`pf-tabs-item ${activeTab === "noibat" ? "pf-tabs-item-actived" : ""}`}
                                    onClick={() => setActiveTab("noibat")}
                                >
                                    Nổi bật
                                </div>
                                <div
                                    className={`pf-tabs-item ${activeTab === "cuatoi" ? "pf-tabs-item-actived" : ""}`}
                                    onClick={() => setActiveTab("cuatoi")}
                                >
                                    Cá nhân
                                </div>
                            </div>

                            <button className="pr-btn" onClick={() => handleCreatePostModalOpen()}>Tạo bài viết</button>
                        </div>
                        <div className="pfscc2r2">
                            {activeTab === "noibat" ? (
                                <>
                                    {/* <Post />
                                    <Post />
                                    <Post />
                                    <Post />
                                    <Post /> */}
                                </>
                            ) : (
                                <>
                                    {personalPost.map((post, index) => (
                                        <Post key={index} post={post}/>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <CreatePostModal isOpen={isCreatePostModalOpen} setIsOpen={setIsCreatePostModalOpen} />
        </main>
    )
}

export default PostForumPage